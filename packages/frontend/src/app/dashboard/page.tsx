'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Dashboard() {
  const [twitterConnected, setTwitterConnected] = useState(false)
  const [blueskyConnected, setBlueskyConnected] = useState(false)
  const [posts, setPosts] = useState<{ id: string | number; content: string; source: 'twitter' | 'bluesky'; crossPostedTo: 'twitter' | 'bluesky'; timestamp: string  }[]>([
    // { id: 1, content: 'Hello, world!', source: 'Twitter', destination: 'Bluesky', timestamp: new Date().toISOString() },
    // { id: 2, content: 'Cross-posting is awesome!', source: 'Bluesky', destination: 'Twitter', timestamp: new Date().toISOString() },
  ])

  const connectTwitter = () => {
    console.log('Connecting Twitter...')
    setTwitterConnected(true)
  }

  const connectBluesky = () => {
    console.log('Connecting Bluesky...')
    setBlueskyConnected(true)
  }

  useEffect(() => {
    fetch('/api/posts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // accept cors
        'Access-Control-Allow-Origin': '*',
      },
      credentials: 'include',
    }).then((res) => res.json()).then((data) => {
      setPosts(data.posts);
    });
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8 bg-[#F3F4F6] min-h-screen">
      <h1 className="text-4xl font-bold text-[#1E40AF] font-inter">PostSync Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-[#38BDF8]">
          <CardHeader>
            <CardTitle className="text-[#1E40AF] font-inter">Twitter</CardTitle>
            <CardDescription className="font-roboto">Connect your Twitter account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectTwitter} disabled={twitterConnected} 
                    className={`bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-roboto ${twitterConnected ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {twitterConnected ? 'Connected' : 'Connect Twitter'}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#FF6B6B]">
          <CardHeader>
            <CardTitle className="text-[#1E40AF] font-inter">Bluesky</CardTitle>
            <CardDescription className="font-roboto">Connect your Bluesky account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectBluesky} disabled={blueskyConnected}
                    className={`bg-[#FF6B6B] hover:bg-[#E03131] text-white font-roboto ${blueskyConnected ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {blueskyConnected ? 'Connected' : 'Connect Bluesky'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-[#1E40AF] font-inter">Recent Posts</CardTitle>
          <CardDescription className="font-roboto">Your cross-posted content</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter text-[#1E40AF]">Content</TableHead>
                <TableHead className="font-inter text-[#1E40AF]">Source</TableHead>
                <TableHead className="font-inter text-[#1E40AF]">Destination</TableHead>
                <TableHead className="font-inter text-[#1E40AF]">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.length > 0 && posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-roboto">{post.content}</TableCell>
                  <TableCell className="font-roboto">{post.source}</TableCell>
                  <TableCell className="font-roboto">{post.crossPostedTo}</TableCell>
                  <TableCell className="font-roboto">{new Date(post.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}