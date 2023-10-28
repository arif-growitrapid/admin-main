import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { BookmarkFilledIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import React from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import style from '@/app/membership/roles/forms.module.scss';

type Props = {
}

export default function loading(props: Props) {
    // const viewMode = ['editor', 'panel'].includes(searchParams.view || "")
    //     ? searchParams.view as 'editor' | 'panel'
    //     : 'panel'
    const viewMode = 'panel';
    // const isViewModeEditor = viewMode === 'editor';
    const isViewModePanel = viewMode === 'panel';

    return (
        <div className='h-full w-full'>
            <div className='h-full w-full relative'>
                <div className='relative h-full w-full flex flex-row items-stretch'>

                    <div className={`h-full w-full border-r bg-background
                        absolute top-0 left-0 z-[1500]
                        transition-all duration-300
                        ${isViewModePanel ? 'translate-x-0' : '-translate-x-full'}
                        lg:relative lg:translate-x-0
                        sm:w-[25rem]
                        flex flex-col items-stretch
                    `}>

                        <div className={`header w-full h-[41px] border-b p-1
                            flex flex-row flex-wrap items-center justify-between gap-2`}>
                            <div className='flex-grow'></div>

                            <Button
                                className={`h-full px-2 flex gap-2 items-center justify-center bg-[hsl(168,76%,42%)] hover:bg-[hsl(168,76%,38%)] text-white`}
                            >
                                <BookmarkFilledIcon />
                                Save
                            </Button>

                            <Button
                                className='h-full px-2 flex gap-2 items-center justify-center'
                                variant="destructive"
                            >
                                <TrashIcon />
                                Delete Local Copy
                            </Button>

                            <Button
                                className='lg:hidden h-full px-2 flex gap-2 items-center justify-center'
                                variant="outline">
                                <Pencil1Icon /> Open Editor
                            </Button>
                        </div>

                        <div className='flex-grow flex-shrink flex-1 h-[calc(100%-41px)]'>
                            <ScrollArea className='w-full h-full' orientation='vertical'>
                                <div className={`${style.form} w-full px-4 py-4`}>

                                    {/* Title */}
                                    <div className={`${style.form_group} !mb-1`}>
                                        <Input
                                            id='title'
                                            value={''}
                                            placeholder=' '
                                            required
                                        />
                                        <Label htmlFor='title'>Title <span className=''>*</span></Label>
                                    </div>

                                    {/* Slug */}
                                    <p className='text-xs text-muted-foreground'>The slug will be as followed: <span className='underline'>{''}</span></p>

                                    {/* Published & SEO Compatability */}
                                    <div className={`my-1 mt-2 py-2 px-[0.7rem] border rounded-[5px] flex flex-row items-center gap-4`}>
                                        <div className='flex-grow flex flex-row items-center gap-4'>
                                            <Label htmlFor='is_published'>Published</Label>
                                            <Switch
                                                id='is_published'
                                                checked={false}
                                            />
                                        </div>

                                        <div className='flex-grow flex flex-row items-center gap-4'>
                                            <Label htmlFor='is_seo_compatabile'>SEO Compatable</Label>
                                            <Switch
                                                id='is_seo_compatabile'
                                                checked={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div className={`${style.form_group} !mb-1`}>
                                        <textarea
                                            id='excerpt'
                                            name='excerpt'
                                            value={''}
                                            placeholder=' '
                                            className='min-h-[100px] resize-y'
                                        ></textarea>
                                        <Label htmlFor='excerpt'>Excerpt</Label>
                                    </div>

                                    {/* Tags */}
                                    <div className={`${style.form_group} !mb-1`}>
                                        <textarea
                                            name='tags'
                                            id='tags'
                                            defaultValue={" "}
                                            placeholder=' '
                                            className='min-h-[80px] resize-y'
                                        ></textarea>
                                        <Label htmlFor='tags'>Tags</Label>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>The tags of the blog. Separate tags with a comma (,).</p>

                                    {/* Categories */}
                                    <div className={`${style.form_group} !mb-1`}>
                                        <textarea
                                            name='categories'
                                            id='categories'
                                            defaultValue={""}
                                            placeholder=' '
                                            className='min-h-[80px] resize-y'
                                        ></textarea>
                                        <Label htmlFor='categories'>Categories</Label>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>The catagories of the blog. Separate categories with a comma (,).</p>

                                    {/* Thumbnail */}
                                    <div className={`${style.form_group} !mb-1`}>
                                        <Input
                                            id='thumbnail'
                                            value={''}
                                            placeholder=' '
                                        />
                                        <Label htmlFor='thumbnail'>Thumbnail</Label>
                                    </div>

                                    {/* Thumbnail Image upload */}
                                    <p className='text-xs text-muted-foreground'>Upload new thumbnail to replace this one. Click the image below.</p>
                                    <div>
                                        <Label htmlFor='thumbnail-image' className='cursor-pointer'>
                                            <img
                                                src={'/images/placeholder.png'}
                                                alt={'Thumbnail'}
                                                className='w-full h-full object-cover rounded-lg'
                                            />
                                        </Label>
                                        <input
                                            id='thumbnail-image'
                                            name='thumbnail-image'
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                        />
                                    </div>

                                </div>
                            </ScrollArea>
                        </div>

                    </div>

                    <div className={`editor-wrapper relative h-full
                        w-full
                        lg:w-[calc(100%-25rem)]`}>
                        <div className='w-full h-full'>
                            <ScrollArea className='w-full h-full' orientation='vertical'>

                                <Skeleton className='w-full h-[41px]' />

                                <div className='w-full'>
                                    <div className='max-w-[900px] mx-auto w-full px-2'>

                                        {/* Random skeleton with random width and height */}
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <Skeleton
                                                key={i}
                                                className='my-2 w-full h-8'
                                                style={{
                                                    // Random width(%) and height(px)
                                                    width: `${Math.floor(Math.random() * 100) + 1}%`,
                                                    height: `${Math.floor(Math.random() * 80) + 10}px`,
                                                }}
                                            />
                                        ))}

                                    </div>
                                </div>

                            </ScrollArea>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}