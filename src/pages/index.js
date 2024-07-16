import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Home() {
    const session = useSession();
    const router = useRouter();
        useEffect(() => {
            if (session.status === "unauthenticated") {
                router.push('/auth/signin');
            }
            if (session.status === "authenticated") {
                router.push('/dashboard');
            }
        }, [session, router])
    return (
            <div className='index_container'>
                <ProgressSpinner  fill="blue"/>
            </div>

    )
}



