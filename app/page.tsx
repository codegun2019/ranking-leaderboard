"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Update the generateUsers function to create 1000 items instead of 100
const generateUsers = () => {
  const users = []
  for (let i = 1; i <= 1000; i++) {
    // Generate Thai mobile number (starting with 06, 08, or 09)
    const prefixes = ["06", "08", "09"]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const middleDigits = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, "0")
    const fullNumber = `${prefix}${middleDigits}`
    const maskedNumber = `${fullNumber.substring(0, 7)}xxx`

    users.push({
      id: i,
      username: maskedNumber,
      score: Math.floor(Math.random() * 50000) + 5000,
      avatar: `/placeholder.svg?height=40&width=40`,
    })
  }
  return users.sort((a, b) => b.score - a.score)
}

export default function LeaderboardPage() {
  const [allUsers, setAllUsers] = useState(generateUsers)
  const [displayUsers, setDisplayUsers] = useState<typeof allUsers>([])
  const [isOpen, setIsOpen] = useState(true)

  // Add a countdown timer state and logic
  // Add these lines after the existing state declarations
  const [timeRemaining, setTimeRemaining] = useState(60)

  // Function to randomly select 1-9 users
  const randomizeUsers = () => {
    const count = Math.floor(Math.random() * 9) + 1 // Random number between 1-9
    const shuffled = [...allUsers].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count).sort((a, b) => b.score - a.score)

    setDisplayUsers([])
    setTimeout(() => {
      setDisplayUsers(selected)
    }, 300)

    // Reset the countdown timer
    setTimeRemaining(60)
  }

  // Update the useEffect to set the interval to 1 minute (60000ms) instead of 5 seconds
  useEffect(() => {
    // Initial display of top 9 users
    setDisplayUsers(allUsers.slice(0, 9))

    // Set up interval for randomization - changed to 1 minute
    const interval = setInterval(randomizeUsers, 60000)
    return () => clearInterval(interval)
  }, [allUsers])

  // Add this useEffect for the countdown timer
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Reset to 60 when it reaches 0
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-orange-300 p-3 rounded-full shadow-lg"
      >
        Show Leaderboard
      </button>
    )

  return (
    <div className="min-h-screen flex items-center justify-center bg-peach-100" style={{ backgroundColor: "#FFDECB" }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-orange-300 rounded-3xl p-4 shadow-xl relative"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-orange-600 hover:text-orange-800"
        >
          <X size={24} />
        </button>

        {/* Leaderboard Header */}
        <div className="relative h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500 rounded-full transform -skew-y-1 shadow-inner"></div>
          <div className="absolute inset-x-0 top-0 bottom-2 bg-red-400 rounded-full transform -skew-y-1"></div>
          <h1 className="relative text-3xl font-extrabold text-white tracking-wider z-10 mt-1">LEADERBOARD</h1>
        </div>

        {/* Leaderboard Content */}
        <div className="bg-orange-100 rounded-2xl p-3">
          <div className="bg-orange-400 rounded-xl p-2">
            <AnimatePresence>
              {displayUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center mb-2 last:mb-0 rounded-xl p-2 ${
                    index === 0
                      ? "bg-yellow-200 border-2 border-yellow-500"
                      : index === 1
                        ? "bg-blue-200 border-2 border-blue-500"
                        : index === 2
                          ? "bg-pink-200 border-2 border-pink-500"
                          : "bg-orange-200"
                  } ${index < 3 ? "transform hover:scale-105 transition-transform shadow-md" : ""}`}
                >
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {index < 3 ? (
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-yellow-300 text-yellow-800 shadow-inner shadow-yellow-500"
                            : index === 1
                              ? "bg-blue-300 text-blue-800 shadow-inner shadow-blue-500"
                              : "bg-pink-300 text-pink-800 shadow-inner shadow-pink-500"
                        }`}
                      >
                        <span className="text-xl font-bold">{index + 1}</span>
                      </motion.div>
                    ) : (
                      <span className="text-xl font-bold text-orange-700">{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full bg-white overflow-hidden ${
                      index < 3 ? "border-2 border-orange-500" : "border-2 border-orange-300"
                    } ml-2`}
                  >
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>

                  {/* Username (now phone number) */}
                  <div className="flex-1 ml-3">
                    <span className={`font-bold ${index < 3 ? "text-lg" : "text-base"} text-orange-800`}>
                      {user.username}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center">
                    <div
                      className={`${
                        index < 3 ? "w-10 h-10" : "w-8 h-8"
                      } bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-500 ${
                        index < 3 ? "animate-pulse" : ""
                      }`}
                    >
                      <div className={`${index < 3 ? "w-8 h-8" : "w-6 h-6"} bg-yellow-300 rounded-full`}></div>
                    </div>
                    <span className={`ml-2 font-bold ${index < 3 ? "text-xl" : "text-lg"}`}>{user.score}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Top 3 Winners Banner */}
        {displayUsers.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-xl p-3 text-center shadow-md">
            <h2 className="text-white font-bold text-lg">🏆 Top Winners 🏆</h2>
            <div className="flex justify-around mt-2">
              {displayUsers.slice(0, Math.min(3, displayUsers.length)).map((user, index) => (
                <motion.div
                  key={`winner-${user.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? "bg-yellow-300" : index === 1 ? "bg-blue-300" : "bg-pink-300"
                    }`}
                  >
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm font-bold text-white mt-1">{user.score}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="mt-4 text-center">
          <span className="text-orange-800 font-bold">Next random in: </span>
          <span className="text-orange-600 font-bold">{timeRemaining}</span>
          <span className="text-orange-800 font-bold"> seconds</span>
        </div>

        {/* Randomize Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={randomizeUsers}
          className="mt-2 w-full bg-orange-500 text-white font-bold py-2 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Randomize from 1000 Numbers
        </motion.button>
      </motion.div>
    </div>
  )
}

