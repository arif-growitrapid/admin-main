import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DBAuthType } from '@/types/auth'
import React from 'react'

export default function UserModal({ user }: { user: DBAuthType }) {
    return (
        <DialogContent className="w-[calc(100%-2rem)] max-w-[1200px] h-[calc(100%-5rem)] max-h-[800px] rounded-lg">
            <ScrollArea className='h-full w-full' orientation='both'>

                <DialogHeader className='mb-4 border-b-2 pb-2'>
                    <DialogTitle>View User Data</DialogTitle>
                    <DialogDescription>
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">User ID:</span>
                            <span className="text-muted-foreground">{user.id}</span>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className='flex gap-5 items-stretch justify-start p-2 border-2 rounded-lg'>

                    <Avatar className={`h-32 w-32 rounded-lg`}>
                        <AvatarImage
                            src={user.image || ""}
                            alt={user.name || user.email || ""}
                            referrerPolicy='no-referrer'
                        />
                        <AvatarFallback className={`h-full w-full rounded-none`}>
                            {user.name?.split(" ").map(e => e.charAt(0)).join("")}
                        </AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col justify-center items-start'>
                        <h2 className='text-2xl font-semibold tracking-wider'>{user.name}</h2>
                        <p className='text-lg font-medium text-muted-foreground'>{user.email}</p>
                        <p className='text-base font-medium text-muted-foreground'>Registored On: {new Date(user.createdAt).toDateString()}</p>
                        <p className='text-base font-medium text-muted-foreground'>Status:&nbsp;
                            <Badge variant="outline" className={`rounded-full
                                ${user.status === "active" ? "border-green-500" : user.status === "pending" ? "border-yellow-500" : "border-red-600"}
                                ${user.status === "active" ? "bg-green-500" : user.status === "pending" ? "bg-yellow-500" : "bg-red-600"}
                                [--tw-bg-opacity:0.3]
                            `}>{user.status.toUpperCase()}</Badge>
                        </p>
                    </div>

                </div>

            </ScrollArea>
        </DialogContent>
    )
}