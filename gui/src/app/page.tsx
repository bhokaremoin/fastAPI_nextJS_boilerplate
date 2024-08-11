import dynamic from 'next/dynamic'

const ClientHome = dynamic(() => import('@/components/Home'), {ssr: false})

export default function Home() {
    return <div><ClientHome/></div>
}