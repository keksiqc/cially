"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search } from "lucide-react";

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

            <div className="mx-5 mt-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                placeholder="User ID"
                                                {...field}
                                                className="peer pr-24" // space for the button
                                            />
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            className="absolute top-1/2 right-2 -translate-y-1/2 h-8 px-3 text-sm
                         opacity-0 translate-x-2 scale-95
                         transition-all duration-300 ease-in-out
                         peer-focus:opacity-100 peer-focus:translate-x-0 peer-focus:scale-100 rounded-full bg-transparent hover:bg-white/5"
                                        >
                                            <Search className="text-white" />
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>



            </div>

            <div className="place-self-center w-full mt-10 ">
                <Card className="mx-5">
                    <CardHeader>
                        <div className="grid grid-cols-2">
                            <div className="place-self-start">
                                <div className="grid grid-cols-2 gap-0">

                                    <Avatar className="w-15 h-15">
                                        <AvatarImage src="https://cdn.discordapp.com/avatars/1095304752495083521/1f2d2d43b7bfe36fa013b301a9687902.webp?size=128" />
                                        <AvatarFallback></AvatarFallback>
                                    </Avatar>
                                    <div className="place-self-center font-bold">skellgreco</div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-3"></hr>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="place-self-start">
                                <div>Joins: <div className="inline text-gray-300">1</div></div>
                                <div>Leaves: <div className="inline text-gray-300">3</div></div>
                                <div>Total Messages: <div className="inline text-gray-300">129</div></div>
                                <div>Most Active Channel: <div className="inline text-gray-300">#tsavalen-romalem</div></div>
                            </div>
                            <div className="place-self-start">
                                <div>Average Message Length: <div className="inline text-gray-300">6</div></div>
                                <div>Invites Sent: <div className="inline text-gray-300">10</div></div>
                                <div>Joins from Invites: <div className="inline text-gray-300">28</div></div>
                            </div>
                        </div>


                    </CardContent>

                </Card>

            </div >

            <div className="mt-5 pb-5 text-center text-gray-600 text-xs">
                Thanks for using Cially Dashboard!
            </div>

        </>
    );

}
