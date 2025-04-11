'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

const Create = () => {
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [status, setStatus] = React.useState('pending')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:8000/api/post-tasks', {title, description, status})
        router.push('/')
    }

    return (
        <div className='flex flex-col items-center py-20'>
            <h1 className='text-3xl'>Create New Task</h1>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4 mt-6 border p-6'>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title}
                    className='p-2 border border-slate-500' 
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    className='p-2 border border-slate-500'
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button className='w-full bg-green-300 py-1.5'>Create Task</button>     
            </form>
        </div>
    )
}

export default Create