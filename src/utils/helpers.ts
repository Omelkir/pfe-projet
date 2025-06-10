export function setStorageData(el: string, value: any) {
  const storageString = window.localStorage.getItem('storage_data')
  let storage: any = {}

  // Parse only if the string is not null
  if (storageString) {
    try {
      storage = JSON.parse(storageString)
    } catch (error) {}
  }

  storage[el] = value // Update or add the new value
  window.localStorage.setItem('storage_data', JSON.stringify(storage))
}

export function getStorageData(el?: string) {
  const storageString = window.localStorage.getItem('storage_data')

  if (!storageString) return el ? undefined : {}

  let storage: any = {}

  try {
    storage = JSON.parse(storageString)
  } catch (error) {}

  return el ? storage[el] : storage
}

export function deleteStorageData() {
  window.localStorage.removeItem('storage_data')
}
