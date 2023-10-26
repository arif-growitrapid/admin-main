"use client"

import WysiwigEditor from '@/components/editor/wysiwig'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { updateBlog } from '@/functions/blogs'
import { BlogPostType } from '@/types/blog'
import { BookmarkFilledIcon, Pencil1Icon, TrashIcon, UpdateIcon } from '@radix-ui/react-icons'
import React from 'react'
import style from '@/app/membership/roles/forms.module.scss';
import { slugify } from '@/utils/web'
import { Switch } from '@/components/ui/switch'

type Props = {
    blog: BlogPostType,
    searchParams: {
        view?: 'editor' | 'panel'
    }
}

export default function Editor({
    blog,
    searchParams
}: Props) {
    // Will only work on mobile devices
    // Side panel on mobile devices will actually behave like a separate page (not actually).
    // On desktop, it will be a side panel (not collapsible).
    // Breakpoint for mobile devices is 1024px (tailwindcss: lg)
    const [viewMode, setViewMode] = React.useState<'editor' | 'panel'>(['editor', 'panel'].includes(searchParams.view || "")
        ? searchParams.view as 'editor' | 'panel'
        : 'panel');
    // Get Boolean value from search params
    const isViewModeEditor = viewMode === 'editor';
    const isViewModePanel = viewMode === 'panel';

    React.useEffect(() => {
        // Update URL search params
        const url = new URL(window.location.href);
        url.searchParams.set('view', viewMode);
        window.history.replaceState({}, '', url.href);
    }, [viewMode]);

    const { toast } = useToast();
    const [data, setData] = React.useState<BlogPostType>(blog);
    const [isSaving, setIsSaving] = React.useState(false);
    const [updateContent, setUpdateContent] = React.useState(new Date().getTime());
    const [isPending, startTransition] = React.useTransition();

    function saveData() {
        setIsSaving(true);

        startTransition(async () => {
            const res = await updateBlog(blog._id, {
                _id: data._id.toString() as any,
                title: data.title,
                slug: data.slug,
                is_published: data.is_published,
                content: data.content,
                excerpt: data.excerpt,
                thumbnail: data.thumbnail,
                time_to_read: data.time_to_read,

                tags: data.tags,
                categories: data.categories,

                is_seo_compatabile: data.is_seo_compatabile,
            }, window.location.pathname);

            if (res.status === 200) {
                setIsSaving(false);

                toast({
                    title: 'Canges saved successfully',
                    description: 'Your changes have been saved successfully.',
                    variant: 'default',
                });
            } else {
                setIsSaving(false);

                toast({
                    title: 'Error',
                    description: 'An error occurred while saving your changes: ' + res.message,
                    variant: 'destructive',
                });
            }
        });
    }

    return (
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
                        <AlertDialog>
                            <div className='flex-grow'></div>

                            <Button
                                className={`h-full px-2 flex gap-2 items-center justify-center bg-[hsl(168,76%,42%)] hover:bg-[hsl(168,76%,38%)] text-white ${isSaving ? "cursor-default" : "cursor-pointer"}`}
                                disabled={isSaving}
                                onClick={saveData}
                            >
                                {isSaving ? <UpdateIcon className='animate-spin' /> : <BookmarkFilledIcon />}
                                Save
                            </Button>

                            <AlertDialogTrigger asChild>
                                <Button
                                    className='h-full px-2 flex gap-2 items-center justify-center'
                                    variant="destructive"
                                >
                                    <TrashIcon />
                                    Delete Local Copy
                                </Button>
                            </AlertDialogTrigger>

                            <Button
                                className='lg:hidden h-full px-2 flex gap-2 items-center justify-center'
                                onClick={() => setViewMode('editor')}
                                variant="outline">
                                <Pencil1Icon /> Open Editor
                            </Button>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Local Copy</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the local copy of this blog post? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={e => {
                                        // Warning: This will delete the blog permanently from local storage.
                                        //          This action cannot be undone.
                                        const id = (blog._id || "default") + ".editor";
                                        const localData = localStorage.getItem(id);
                                        if (!localData || localData === "") return;

                                        localStorage.removeItem(id);
                                        setUpdateContent(new Date().getTime());
                                    }}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div className='flex-grow flex-shrink flex-1 h-[calc(100%-41px)]'>
                        <ScrollArea className='w-full h-full' orientation='vertical'>
                            <BlogForm
                                data={data}
                                setData={setData}
                            />
                        </ScrollArea>
                    </div>

                </div>

                <div className={`absolute w-full h-full top-0 left-0 z-[1499]
                    transition-all duration-300 bg-background/80 backdrop-blur-sm
                    lg:!hidden
                    ${isViewModePanel ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
                `} onClick={() => setViewMode('editor')}></div>

                <div className={`editor-wrapper relative h-full
                    w-full
                    lg:w-[calc(100%-25rem)]`}>
                    <div className='w-full h-full'>
                        <ScrollArea className='w-full h-full' orientation='vertical'>
                            <WysiwigEditor
                                initialContent={blog.content}
                                id={blog._id}
                                shouldSaveLocally={true}
                                update={updateContent}
                                customToolbarButton={{
                                    label: 'Back',
                                    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>`,
                                    tooltip: 'Back',
                                    className: 'lg:!hidden',
                                    onClick: () => setViewMode('panel')
                                }}
                                onContentChange={content => {
                                    setData({
                                        ...data,
                                        content
                                    });
                                }}
                            />
                        </ScrollArea>
                    </div>
                </div>

            </div>
        </div>
    )
}

function BlogForm({ data, setData }: {
    data: BlogPostType,
    setData: React.Dispatch<React.SetStateAction<BlogPostType>>
}) {

    return <div className={`${style.form} w-full px-4 py-4`}>

        {/* Title */}
        <div className={`${style.form_group} !mb-1`}>
            <Input
                id='title'
                value={data.title}
                placeholder=' '
                onChange={e => setData({
                    ...data,
                    title: e.target.value,
                    slug: slugify(e.target.value)
                })}
                required
            />
            <Label htmlFor='title'>Title <span className=''>*</span></Label>
        </div>

        {/* Slug */}
        <p className='text-xs text-muted-foreground'>The slug will be as followed: <span className='underline'>{data.slug}</span></p>

        {/* Published & SEO Compatability */}
        <div className={`my-1 mt-2 py-2 px-[0.7rem] border rounded-[5px] flex flex-row items-center gap-4`}>
            <div className='flex-grow flex flex-row items-center gap-4'>
                <Label htmlFor='is_published'>Published</Label>
                <Switch
                    id='is_published'
                    checked={data.is_published}
                    onCheckedChange={e => setData({
                        ...data,
                        is_published: e
                    })}
                />
            </div>

            <div className='flex-grow flex flex-row items-center gap-4'>
                <Label htmlFor='is_seo_compatabile'>SEO Compatable</Label>
                <Switch
                    id='is_seo_compatabile'
                    checked={data.is_seo_compatabile}
                    onCheckedChange={e => setData({
                        ...data,
                        is_seo_compatabile: e
                    })}
                />
            </div>
        </div>

        {/* Excerpt */}
        <div className={`${style.form_group} !mb-1`}>
            <textarea
                id='excerpt'
                name='excerpt'
                value={data.excerpt}
                placeholder=' '
                onChange={e => setData({
                    ...data,
                    excerpt: e.target.value
                })}
                className='min-h-[100px] resize-y'
            ></textarea>
            <Label htmlFor='excerpt'>Excerpt</Label>
        </div>

        {/* Tags */}
        <div className={`${style.form_group} !mb-1`}>
            <textarea
                name='tags'
                id='tags'
                defaultValue={data.tags.join(', ')}
                placeholder=' '
                onChange={e => setData({
                    ...data,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                })}
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
                defaultValue={data.categories.join(', ')}
                placeholder=' '
                onChange={e => setData({
                    ...data,
                    categories: e.target.value.split(',').map(tag => tag.trim())
                })}
                className='min-h-[80px] resize-y'
            ></textarea>
            <Label htmlFor='categories'>Categories</Label>
        </div>
        <p className='text-xs text-muted-foreground'>The catagories of the blog. Separate categories with a comma (,).</p>

        {/* Thumbnail */}
        <div className={`${style.form_group} !mb-1`}>
            <Input
                id='thumbnail'
                value={data.thumbnail}
                placeholder=' '
                onChange={e => setData({
                    ...data,
                    thumbnail: e.target.value
                })}
            />
            <Label htmlFor='thumbnail'>Thumbnail</Label>
        </div>

        {/* Thumbnail Image upload */}
        <p className='text-xs text-muted-foreground'>Upload new thumbnail to replace this one. Click the image below.</p>
        <div>
            <Label htmlFor='thumbnail-image' className='cursor-pointer'>
                <img
                    src={data.thumbnail}
                    alt={data.title}
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
}
