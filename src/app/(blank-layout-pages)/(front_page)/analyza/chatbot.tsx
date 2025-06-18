'use client'

import React, { useEffect, useRef, useState, type FormEvent } from 'react'

import { Paperclip } from 'lucide-react'

import ChatbotIcon from './ChatbotIcon'
import { getStorageData } from '@/utils/helpersFront'
import ConnModal from '@/components/modals/conOblig'

const GEMINI_API_KEY = 'AIzaSyBZ9zq29OVYpcokmaR3nghpGSfbDC6WGd8'

type ChatMessageType = {
  role: 'user' | 'model'
  text: string
  isError?: boolean
  isPdfAnalysisPrompt?: boolean
}

const cleanHtmlText = (raw: string) => {
  return raw
    .replace(/```html\s*/g, '')
    .replace(/```/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/>\s+</g, '><')
    .trim()
}

const ChatMessage: React.FC<{ chat: ChatMessageType }> = ({ chat }) => {
  return (
    <div className={`message ${chat.role === 'model' ? 'bot' : 'user'}-message ${chat.isError ? 'error' : ''}`}>
      {chat.role === 'model' && <ChatbotIcon />}
      <div className='message-text'>
        {chat.isPdfAnalysisPrompt && chat.role === 'user' ? (
          '📄 Analyse PDF'
        ) : chat.role === 'model' ? (
          <div dangerouslySetInnerHTML={{ __html: cleanHtmlText(chat.text) }} />
        ) : (
          chat.text.split('\n').map((line, index) => <p key={index}>{line}</p>)
        )}
      </div>
    </div>
  )
}

const ChatForm: React.FC<{
  onSendMessage: (message: string) => void
  onFileSelect: (file: File) => void
  loading: boolean
}> = ({ onSendMessage, onFileSelect, loading }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userMessage = inputRef.current?.value.trim()

    if (!userMessage) return

    onSendMessage(userMessage)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      onFileSelect(file)
      e.target.value = ''
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className='chat-form'>
      <input ref={inputRef} placeholder='Message...' className='message-input' required disabled={loading} />
      <label>
        <input type='file' accept='application/pdf' className='hidden' onChange={handleFileChange} />
        <Paperclip className='mx-4 cursor-pointer' />
      </label>
      <button type='submit' id='send-message' className='material-symbols-rounded' disabled={loading}>
        arrow_upward
      </button>
    </form>
  )
}

const Chatbot: React.FC = () => {
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const userData = getStorageData('user')
  const [showChatbot, setShowChatbot] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([
    { role: 'model', text: 'Bonjour Comment puis-je vous aider aujourd’hui ?' }
  ])

  const [isLoadingBotResponse, setIsLoadingBotResponse] = useState(false)

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  useEffect(() => {
    const getConversation = async () => {
      if (!userData?.id) return

      try {
        const response = await fetch(`${window.location.origin}/api/conversation/liste?id_patient=${userData.id}`)
        const responseData = await response.json()

        if (!response.ok || responseData.erreur) {
          console.error('Failed to fetch past conversations:', responseData.erreur || 'Unknown error')

          return
        }

        const oldMessages: ChatMessageType[] = []

        responseData.data.forEach((conv: any) => {
          const isPdf =
            conv.question.toLowerCase().includes('résultats complets') &&
            conv.question.toLowerCase().includes('analyse médicale')

          oldMessages.push({
            role: 'user',
            text: conv.question,
            isPdfAnalysisPrompt: isPdf
          })

          oldMessages.push({
            role: 'model',
            text: conv.reponse
          })
        })

        // Ici, on remplace totalement l'historique par message d'accueil + historique DB
        setChatHistory([{ role: 'model', text: 'Bonjour Comment puis-je vous aider aujourd’hui ?' }, ...oldMessages])
      } catch (error) {
        console.error('Error fetching past conversations:', error)
      }
    }

    getConversation()
  }, [userData?.id])

  const handleSaveConversation = async (question: string, resultToSave: string) => {
    try {
      await fetch(`${window.location.origin}/api/conversation/ajouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_patient: userData?.id || null,
          question,
          result: resultToSave
        })
      })
    } catch (error) {
      console.log('Erreur handleSaveConversation:', error)
    }
  }

  const generateBotResponse = async (userQuestion: string) => {
    setIsLoadingBotResponse(true)
    setChatHistory(prev => [...prev, { role: 'model', text: 'Analyse en cours...' }])

    const updateHistory = (text: string, isError = false) => {
      setChatHistory(prev =>
        prev.filter(msg => msg.text !== 'Analyse en cours...').concat({ role: 'model', text, isError })
      )
      setIsLoadingBotResponse(false)
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuestion }] }],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7
            }
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error?.message || 'API erreur')
      }

      const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse'

      console.log('apiResponseText')

      updateHistory(apiResponseText)
      await handleSaveConversation(userQuestion, apiResponseText)
    } catch (error: any) {
      updateHistory(error.message || 'Error occurred', true)
    }
  }

  const handleSendMessage = (message: string) => {
    setChatHistory(prev => [...prev, { role: 'user', text: message }])
    generateBotResponse(message)
  }

  const handleFileChangePDF = async (file: File) => {
    setIsLoadingBotResponse(true)

    setChatHistory(prev => [...prev, { role: 'user', text: `📄 ${file.name}`, isPdfAnalysisPrompt: true }])
    setChatHistory(prev => [...prev, { role: 'model', text: 'Analyse en cours...' }])

    const formData = new FormData()

    formData.append('file', file)

    try {
      const response = await fetch('http://http://176.31.223.21:5001/extract', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok || !result.text) {
        setChatHistory(prev =>
          prev
            .filter(msg => msg.text !== 'Analyse en cours...')
            .concat({ role: 'model', text: "Erreur lors de l'extraction du texte du PDF.", isError: true })
        )
        setIsLoadingBotResponse(false)

        return
      }

      const extractedText = result.text.toLowerCase()

      const medicalKeywords = [
        'analyse',
        'sanguine',
        'hémoglobine',
        'globule',
        'plaquette',
        'créatinine',
        'urée',
        'glycémie',
        'biochimie',
        'mg/l',
        'g/l',
        'mmol/l',
        'valeurs',
        'résultats',
        'paramètres',
        'examen',
        'hématologie',
        'sang',
        'normes',
        'taux'
      ]

      const foundKeywords = medicalKeywords.filter(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(extractedText))

      const isMedical = foundKeywords.length >= 3

      if (!isMedical) {
        setChatHistory(prev =>
          prev
            .filter(msg => msg.text !== 'Analyse en cours...')
            .concat({ role: 'model', text: '❌ Le fichier PDF ne semble pas contenir une analyse médicale.' })
        )
        setIsLoadingBotResponse(false)

        return
      }

      const fullQuestionForAPI = `
Voici les résultats complets d'une analyse médicale :

${extractedText}

Analyse ces résultats en te basant uniquement sur leur valeur biologique réelle.

Je veux que tu me répondes avec une analyse médicale complète, sans introduction inutile, selon les points suivants pour CHAQUE paramètre biologique trouvé dans le texte :

1. Est-ce que la valeur est normale, basse ou élevée ? (comparée aux normes si disponibles)
2. Quelle est l’interprétation médicale possible de cette valeur ?
3. Quelles sont les causes ou maladies possibles si cette valeur est anormale ?
4. Si nécessaire, fais des liens entre les paramètres (ex : inflammation, diabète, infection...).

⚠️ Format demandé : uniquement en HTML structuré propre pour affichage.

Utilise :
- <h3> pour le nom de l’analyse (ex: Numération Globulaire, Ionogramme, Bilan Hépatique…)
- <h4> pour chaque paramètre (ex: Hémoglobine, Sodium, ASAT…)
- <p> pour les explications
- <ul><li></li></ul> pour les maladies ou hypothèses possibles

❌ Ne commence pas par "Analysons les résultats de...", va directement au contenu. Ne dis pas "voici ce que cela signifie", mais donne la signification médicale directement.
`

      console.log(fullQuestionForAPI)

      setChatHistory(prev => prev.filter(msg => msg.text !== 'Analyse en cours...'))
      generateBotResponse(fullQuestionForAPI)
    } catch (error) {
      console.error('Erreur fetch PDF:', error)
      setChatHistory(prev =>
        prev
          .filter(msg => msg.text !== 'Analyse en cours...')
          .concat({ role: 'model', text: "Erreur réseau ou serveur lors de l'extraction du PDF.", isError: true })
      )
      setIsLoadingBotResponse(false)
    }
  }

  const handleToggleChatbot = () => {
    if (!userData || !userData.id) {
      setIsModalOpen(true)

      return
    }

    setShowChatbot(prev => !prev)
  }

  useEffect(() => {
    const link = document.createElement('link')

    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      <button onClick={handleToggleChatbot} id='chatbot-toggler'>
        <span className='material-symbols-rounded'>mode_comment</span>
        <span className='material-symbols-rounded'>close</span>
      </button>

      {showChatbot && (
        <div className='chatbot-popup'>
          <div className='chat-header'>
            <div className='header-info'>
              <ChatbotIcon />
              <h2 className='logo-text'>Analyza</h2>
            </div>
            <button onClick={() => setShowChatbot(false)} className='material-symbols-rounded'>
              keyboard_arrow_down
            </button>
          </div>

          <div ref={chatBodyRef} className='chat-body'>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className='chat-footer'>
            <ChatForm
              onSendMessage={handleSendMessage}
              onFileSelect={handleFileChangePDF}
              loading={isLoadingBotResponse}
            />
          </div>
        </div>
      )}
      <ConnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Chatbot
