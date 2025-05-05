"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

let WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

import { Suspense } from "react";

export default function UserSearchPage() {


    return (
        <Suspense>
            <ClientComponent />
        </Suspense>
    )
}

function ClientComponent() {
    const searchParams = useSearchParams();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <>
            <div className="mt-10 ml-10 text-2xl">User Search</div>
            <div className=" ml-10 text-sm text-white/50">Get details regarding any user in your Discord Server</div>
            <hr className="mt-2 mr-5 ml-5 w-50 sm:w-dvh"></hr>

            <div className="place-self-center w-[100%] mt-15">
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-2">
                            <div className="place-self-start">
                                <Avatar className=" w-20 h-20">
                                    <AvatarImage src="ht" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>username</div>
                            </div>
                        </div>

                        <hr></hr>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>

            </div>

            <div className="place-self-center mt-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="inline">
                        <FormField
                            control={form.control}
                            name="id"

                            render={({ field }) => (
                                <FormItem>
                                    <FormControl className="inline">
                                        <Input placeholder="User ID" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="inline">Submit</Button>
                    </form>
                </Form>
            </div>

        </>
    );

}
