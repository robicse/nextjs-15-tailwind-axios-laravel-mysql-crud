"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import * as React from "react";

export default function PostDetail(props) {
    const rawParams = props.params;
    const params = React.use(rawParams); // ✅ unwrap the params promise
    const { id } = params;
    // console.log('id', id)

    const searchQuery = useSearchParams();
    const mode = searchQuery.get('mode');

    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(mode === 'edit');
    const [title, setTitle] = useState('12');
    const [description, setDescription] = useState('34');
    const [status, setStatus] = useState('pending');

    const router = useRouter();

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    useEffect(() => {
        setEditing(mode === 'edit');
    }, [mode]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/get-task/${id}`);
            setTitle(response.data.data.title);
            setDescription(response.data.data.description);
            setTask(response.data.data);
        } catch (err) {
            setError("Failed to fetch task.");
            console.error(err);
        } finally {
            // Delay loading false for 1 seconds
            setTimeout(() => {
                setLoading(false);
            }, 1000); // 10,00 ms = 1 seconds
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`http://127.0.0.1:8000/api/update-task/${id}`, { title, description, status });
        setEditing(false);
        fetchPost();
    };

    const handleDelete = async () => {
        await axios.post(`http://127.0.0.1:8000/api/delete-task/${id}`);
        router.push('/');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="py-20">
            <h1 className="text-3xl text-center">{editing ? 'Edit Task' : 'Read Task'}</h1>
            {task != null && ( 
                <div className='flex flex-col items-center'>
                    {
                        editing ? (
                            <form onSubmit={handleSubmit} className='flex flex-col space-y-4 mt-6 border p-6'>
                                <input
                                    type='text'
                                    placeholder='Title'
                                    value={title}
                                    className='p-2 border border-slate-500'
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <textarea
                                    value={description}
                                    className='border border-slate-500'
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <button className='w-full bg-green-300'>Save</button>
                            </form>
                        ) : (
                            <div className='mt-5'>
                                <h1 className='text-2xl font-bold'>{task.title}</h1>
                                <p>{task.description}</p>
                            </div>
                        )
                    }
                    <div className='flex space-x-4 mt-5'>
                        <button onClick={() => router.push('/')} className='w-full bg-green-400 px-3 py-1.5'>Home</button>
                        <button onClick={() => setEditing(!editing)} className='w-full bg-green-400 px-3 py-1.5'>Edit</button>
                        <button onClick={handleDelete} className='w-full bg-green-400 px-3 py-1.5'>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}
