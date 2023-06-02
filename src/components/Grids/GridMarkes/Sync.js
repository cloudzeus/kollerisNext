import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Sync = () => {
  
    useEffect(() => {
        const handleSync = async () => {
            try {
                const resp = await axios.post('/api/admin/markes/markes', { action: 'sync' })
                console.log(resp.data)
            } catch (error) {
                console.log(error)
            }
        }
        handleSync()
    }, [])
    return (


    <div>Sync</div>
  )
}

export default Sync