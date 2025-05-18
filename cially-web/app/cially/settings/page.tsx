"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { DatabaseBackup } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function SettingsPage() {

    const router = useRouter()


    const [deleteStatus, setDeleteStatus] = useState('');

    const handleDelete = async () => {
        setDeleteStatus('Deleting...');

        try {
            const response = await fetch(`/api/cially/eraseDatabase`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDeleteStatus('Item deleted successfully!');
                router.push('/')
            } else {
                const errorData = await response.json();
                setDeleteStatus(`Deletion failed: ${errorData?.message || 'An error occurred'}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setDeleteStatus('Deletion failed due to a network error.');
        }
    };

    return (
        <div className="min-w-full min-h-dvh ">
            <div>

                <div className="text-2xl mt-4 ml-2">
                    Settings
                </div>
                <div className="text-sm text-white/50 mt-1 ml-2">
                    Manage your dashboard settings and preferences
                </div>
            </div>

            <Card className="w-[75%] mt-10 border-[1px] border-red-500/40">
                <CardHeader>
                    <CardTitle><DatabaseBackup className="inline w-5 mr-2 -translate-y-0.5" /> Erase Database</CardTitle>
                    <CardDescription>Click the button bellow to erase all the data in your database. This action is irreversible!</CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className=" place-self-center cursor-pointer hover:outline-1 outline-0 outline-amber-950 transition-all">Erase</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This is a permanent action. Confirming will erase all server data, and this process cannot be reversed. Ensure you understand the implications before proceeding.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete()} className="bg-red-600 text-white hover:bg-red-800 transition">Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>


        </div>
    )
}