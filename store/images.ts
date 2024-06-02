import { create } from 'zustand'

interface ImagesStoreProps {
  usedUrls: string[],
  loadedUrls: string[],
  initImagesUrls: (urls: string[]) => void,
  setUsedUrls: (urls: string[]) => void,
  setLoadedUrl: (urls: string | undefined) => void, 
  deleteloadedUrl: (url: string) => void,
  clearAllImg: () => void,
}

const useImagesStore = create<ImagesStoreProps>((set, get) => ({
  usedUrls: [],
  loadedUrls: [],
  initImagesUrls: (urls) => set((state) => {
    return {...state, usedUrl: urls, loadedUrl: [] }
  }),
  setUsedUrls: (urls) => set((state) => {
    return {...state, usedUrl: urls }
  }),
  setLoadedUrl: (url: string | undefined) => set((state) => {
    if (!url) return state;
    state.loadedUrls.push(url);
    return ({...state, loadedUrld: state.loadedUrls });
  }),
  deleteloadedUrl: (url) => set((state) => {
    const filter = state.loadedUrls.filter(urlStr => urlStr  !== url);
    return { loadedUrls: filter };
  }),
  clearAllImg: () => set((state) => ({ 
    usedUrls: [], 
    loadedUrls: [], 
  })),
})
)

export { useImagesStore }