'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TreePine,
  Network,
  Search,
  Brain,
  Trophy,
  Timer,
  TrendingUp,
  ChartAreaIcon,
} from 'lucide-react'
import CategoryCard from '@/components/CategoryCard'
import { StarButton } from '@/components/StarButton'
import { useRef } from 'react'

const Home = () => {
  const router = useRouter()

  const categories = [
    {
      title: "Dynamic Programming",
      description: "Master DP patterns on trees, grids, and sequences",
      icon: TreePine,
      difficulty: "Hard",
      questionsCount: 25,
      estimatedTime: "8-12 min"
    },
    {
      title: "Tree Algorithms",
      description: "DFS, BFS, tree DP, and advanced tree problems",
      icon: Network,
      difficulty: "Medium",
      questionsCount: 30,
      estimatedTime: "6-10 min"
    },
    {
      title: "Sorting & Searching",
      description: "Quick reviews of fundamental algorithms",
      icon: Search,
      difficulty: "Easy",
      questionsCount: 20,
      estimatedTime: "4-6 min"
    },
    {
      title: "Graph Algorithms",
      description: "Shortest paths, MST, topological sorting",
      icon: ChartAreaIcon,
      difficulty: "Hard",
      questionsCount: 28,
      estimatedTime: "10-15 min"
    }
  ];

  const handleCategoryClick = (category: typeof categories[0]) => {
    router.push(`/quiz?category=${encodeURIComponent(category.title)}`)
  };

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-black text-neutral-50">
      <div className="container mx-auto px-4 pt-8">
        <motion.div
        initial={{ opacity: 0, }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        >
          <div className="text-center my-8">
            <StarButton />
            <div className="flex items-center justify-center gap-3 m-3">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-50 to-neutral-400 bg-clip-text text-transparent">
                AlgoRush
              </h1>
            </div>
            <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto mt-7">
              Master DSA with lightning-fast AI quizzes.
            </p>
            <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto mt-2">
              Built for brainy bursts — even on your bus ride! 🚌
            </p>
          </div>

        <div className="flex justify-center m-7">
          <Button onClick={scrollToSection} className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300 p-5 text-base">Get Started</Button>
        </div>
        </motion.div>

        <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
          <Card className="bg-yellow-500/5 backdrop-blur border hover:border-yellow-700 hover:bg-yellow-500/10 transition-all duration-300 ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">Quick Sessions </CardTitle>
              <Timer className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-neutral-50 pb-2 ">5-15 min</div>
              <p className="text-sm text-neutral-400">Perfect for commutes, study breaks, or cramming before class. No fluff—just focus.</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 backdrop-blur border hover:border-blue-700 hover:bg-blue-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400"> Master 100+ DSA Concepts</CardTitle>
              <Brain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-neutral-50 pb-2">From Arrays to Graphs</div>
              <p className="text-sm text-neutral-400">Learn through targeted MCQs and code-driven challenges.</p>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5 backdrop-blur border hover:border-green-700 hover:bg-green-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">Made for Your Phone</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-neutral-50 pb-2">Tap. Solve. Learn. Anywhere.</div>
              <p className="text-sm text-neutral-400">Just pure DSA practice on the go, whether you’re in bed or on a bus.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
        <Card className="bg-black backdrop-blur border border-neutral-900/10 mb-8">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-neutral-50 flex justify-center items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              How AlgoRush Works
            </CardTitle>
            <CardDescription className="text-neutral-400 flex justify-center items-center text-center gap-2 px-2">
              Rapid-fire learning designed for the ADHD world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {["Pick a Topic", "Race the Clock", "Learn & Improve"].map((title, i) => (
                <div className="text-center" key={i}>
                  <div className="w-12 h-12 bg-[rgba(255,255,255,0.4)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-neutral-50 font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-50 mb-2">{title}</h3>
                  <p className="text-sm text-neutral-400 px-4 md:px-0">
                    {i === 0 && "Choose from trees, DP, graphs, and more"}
                    {i === 1 && "Answer questions quickly under time pressure"}
                    {i === 2 && "Get instant feedback and explanations"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>


        <div ref={sectionRef} className="mb-12 pt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-50 mb-8 text-center">
            Choose Your Challenge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                {...category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='flex justify-center pb-2 text-neutral-400'>
        @<a href="https://x.com/alxn787">alxn787</a>
      </div>
    </div>
  )
}

export default Home