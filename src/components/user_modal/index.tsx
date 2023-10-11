"use client";

import { AuthType, DBAuthType } from '@/types/auth'
import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { VscVerified } from 'react-icons/vsc';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { CopyIcon } from '@radix-ui/react-icons';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import CommingSoon from '../svg/comming_soon';

type Props = {
    user: DBAuthType | Partial<AuthType>
}

export default function UserModal({ user }: Props) {
    const { toast } = useToast();

    function StopPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
    }

    return (
        <>
            <style
                jsx={true}
                global={true}
            >{`
                [data-radix-scroll-area-viewport] > div {
                    display: block !important;
                }
            `}</style>
            <div className='p-4 w-full flex flex-col gap-4'>

                <div className='w-full flex flex-col md:flex-row gap-4 justify-center items-center md:items-stretch'>
                    <div className='max-w-[400px] w-full bg-background flex-shrink flex-grow' onClick={StopPropagation}>
                        <div className='flex flex-col gap-2 items-stretch justify-start border-2 rounded-lg overflow-hidden'>

                            <div className='top relative h-[calc(9rem+3rem)]'>
                                <div className='back bg-slate-500 w-full h-36 relative' style={{
                                    backgroundImage: `url(${"https://media.istockphoto.com/id/1341408852/video/colored-smoke-on-a-dark-background-blue-and-red-light-with-smoke.jpg?s=640x640&k=20&c=v2DQUY8IVbli_6FH_9KAs6YWRXlDdYiBJHfp7JFh7NY="})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}>
                                    <Avatar className={`h-32 w-32 rounded-lg absolute -bottom-1/3 left-6 shadow-lg`}>
                                        <AvatarImage
                                            src={user.image || ""}
                                            alt={user.name || user.email || ""}
                                            referrerPolicy='no-referrer'
                                        />
                                        <AvatarFallback className={`h-full w-full rounded-none`}>
                                            {user.name?.split(" ").map(e => e.charAt(0)).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className='absolute left-[calc(2.5rem+8rem)]'>
                                    <h2 className='text-xl font-semibold tracking-wider'>{user.name}</h2>
                                    <p className='text-base font-medium text-muted-foreground flex gap-1 items-center'>
                                        {user.email}
                                        {user.emailVerified && <span
                                            className="text-green-500 text-xl"
                                        ><VscVerified /></span>}
                                    </p>
                                </div>
                            </div>

                            <div className='p-2 pb-0'>
                                <div className='border rounded-lg p-2'>
                                    <p className='text-sm font-medium text-muted-foreground'>{user.bio || "No Bio"}</p>
                                </div>
                            </div>

                            <div className='p-2'>
                                <div className='border rounded-lg overflow-hidden'>
                                    <ScrollArea className='w-full whitespace-nowrap' orientation='horizontal'>
                                        <Table>
                                            <TableBody>
                                                {/* ID */}
                                                <TableRow>
                                                    <TableCell className="font-medium min-w-[150px]">ID</TableCell>
                                                    <TableCell className='flex items-center'>
                                                        {user.id}
                                                        <Button variant="ghost" className='h-8 w-8 p-0 ml-1' onClick={e => {
                                                            navigator.clipboard.writeText(user.id || "").then(() => {
                                                                toast({
                                                                    title: "User ID copied to clipboard",
                                                                    description: <pre className="mt-2 rounded-md bg-muted p-4">
                                                                        <code className="text-muted-foreground">User ID: {user.id}</code>
                                                                    </pre>,
                                                                    className: 'w-full block'
                                                                });
                                                            });
                                                        }}>
                                                            <CopyIcon />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                {/* Registored On */}
                                                <TableRow>
                                                    <TableCell className="font-medium">Registored On</TableCell>
                                                    <TableCell>{new Date(user.createdAt || "").toDateString()}</TableCell>
                                                </TableRow>
                                                {/* Status */}
                                                <TableRow>
                                                    <TableCell className="font-medium">Status</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`rounded-full
                                                    ${user.status === "active" ? "border-green-500" : user.status === "pending" ? "border-yellow-500" : "border-red-600"}
                                                    ${user.status === "active" ? "bg-green-500" : user.status === "pending" ? "bg-yellow-500" : "bg-red-600"}
                                                    [--tw-bg-opacity:0.3]
                                                `}>{user.status?.toUpperCase()}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                                {/* Roles */}
                                                <TableRow>
                                                    <TableCell className="font-medium">Roles</TableCell>
                                                    <TableCell className="text-base font-medium text-muted-foreground flex gap-1 flex-wrap">
                                                        {user.roles?.map((role, i) => (
                                                            <Badge key={i} variant="outline" className={`rounded-full border-none
                                                        ${role === "operator" ? "bg-green-500" : "bg-muted"}
                                                        [--tw-bg-opacity:0.3]
                                                    `}>{role.toUpperCase()}</Badge>
                                                        ))}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Date Of Birth */}
                                                <TableRow>
                                                    <TableCell className="font-medium">Date Of Birth</TableCell>
                                                    <TableCell>{new Date(user.dob || "").toDateString()}</TableCell>
                                                </TableRow>
                                                {/* Emails */}
                                                <TableRow>
                                                    <TableCell className="font-medium">Emails</TableCell>
                                                    <TableCell>
                                                        <p className='text-base font-medium text-muted-foreground flex gap-1 items-center'>
                                                            {user.email}
                                                            {user.emailVerified && <span
                                                                className="text-green-500 text-xl"
                                                            ><VscVerified /></span>}
                                                        </p>
                                                        {user.extraEmails?.map((email, i) => (
                                                            <p key={i} className='text-base font-medium text-muted-foreground flex gap-1 items-center'>
                                                                {email}
                                                            </p>
                                                        ))}
                                                    </TableCell>
                                                </TableRow>
                                                {/* Phones */}
                                                {(user.phone || (user.extraPhones && user.extraPhones.length > 0)) &&
                                                    <TableRow>
                                                        <TableCell className="font-medium">Phones</TableCell>
                                                        <TableCell>
                                                            {user.phone &&
                                                                <p className='text-base font-medium text-muted-foreground flex gap-1 items-center'>
                                                                    +{user.phone?.countryCode} {user.phone?.number}
                                                                    {user.phone?.verified && <span
                                                                        className="text-green-500 text-xl"
                                                                    ><VscVerified /></span>}
                                                                </p>
                                                            }
                                                            {user.extraPhones?.map((phone, i) => (
                                                                <p key={i} className='text-base font-medium text-muted-foreground flex gap-1 items-center'>
                                                                    +{phone.countryCode} {phone.number}
                                                                    {phone.verified && <span
                                                                        className="text-green-500 text-xl"
                                                                    ><VscVerified /></span>}
                                                                </p>
                                                            ))}
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                                {/* Gender */}
                                                <TableRow>
                                                    <TableCell className="font-medium">Gender</TableCell>
                                                    <TableCell>{(user.gender || "Not Defined").toUpperCase()}</TableCell>
                                                </TableRow>
                                                {/* Social Profiles */}
                                                {(user.socialProfiles && user.socialProfiles?.length > 0) &&
                                                    <TableRow>
                                                        <TableCell className="font-medium">Social Profiles</TableCell>
                                                        <TableCell>
                                                            {user.socialProfiles?.map((profile, i) => (
                                                                <p key={i} className='text-base font-medium text-muted-foreground flex gap-1 items-center'>
                                                                    {profile.name.charAt(0).toUpperCase() + profile.name.slice(1)}:
                                                                    <Link href={profile.url} target='_blank' className='text-cyan-400'>{profile.url}</Link>
                                                                </p>
                                                            ))}
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                                {/* <TableRow>
                                                <TableCell className="font-medium"></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow> */}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='border rounded-lg bg-background w-full flex-grow flex-shrink' onClick={StopPropagation}>
                        <div className='flex flex-col items-center justify-center gap-4 p-4 h-full'>
                            <h2 className='text-2xl font-medium text-center text-muted-foreground tracking-widest uppercase'>
                                All content saved by this user
                            </h2>
                            <CommingSoon
                                className='w-full h-auto max-w-[600px] mx-auto'
                            />
                            <p className='text-lg font-medium text-muted-foreground text-center'>This feature is comming soon</p>
                        </div>
                    </div>
                </div>

                <Accordion type="single" collapsible className='w-full border rounded-lg bg-background' onClick={StopPropagation}>
                    <AccordionItem value="raw_data">
                        <AccordionTrigger className='p-4'>Raw User Data</AccordionTrigger>
                        <AccordionContent className='w-full border-t'>
                            <ScrollArea className='w-full h-[400px]' orientation='both'>
                                <pre className='p-4 whitespace-pre'>
                                    <code>
                                        {JSON.stringify(user, null, 2)}
                                    </code>
                                </pre>
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </>
    )
}