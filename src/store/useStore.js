import { Currency } from 'lucide-react'
import { create } from 'zustand'

const useStore = create((set) => ({
    //Auth
    user: null,
    setUser: (user) => set({ user }),
    uploadedFileName: null,
setUploadedFileName: (name) => set({ uploadedFileName: name }),

    logout: () => set({
  user: null,
  uploadedFileName: null,
  transactions: [],
  summary: null,
  currency: 'IN',
  selectedYear: null,
  forecastData: null,
  yirData: {},
  chatHistory: [],
}),



    //Data
    transactions: [],
    setTransactions: (transactions) => set({ transactions }),
    summary: null,
    setSummary: (summary) => set({ summary }),
    currency: 'IN',
    setCurrency: (currency) => set({ currency }),

    //UI
    activeTab: 'upload',
    setActiveTab: (activeTab) => set({ activeTab }),
    selectedYear: null,
    setSelectedYear: (selectedYear) => set({ selectedYear }),

    //Cache

    forecastData: null,
    setForecastData: (forecastData) => set({ forecastData }),
    yirData: {},
    setYirData: (yirData) => set({ yirData }),

    //Chat

    chatHistory: [],
    addMessage: (msg) => set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
    clearChat: () => set({ chatHistory: [] })
}))

export default useStore