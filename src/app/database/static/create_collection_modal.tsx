"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { StaticDBSchemaType } from '@/types/static-db';
import { CaretSortIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import React from 'react'
import style from "@/app/membership/roles/forms.module.scss";
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import radix_icons, { get_radix_icon } from '@/components/radix_icons';

type Props = {}

export default function CreateCollectionModal({ }: Props) {

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [data, setData] = React.useState<{
        name: string; // Name of the collection
        description: string; // Description of the collection
        icon: string; // Icon of the collection
        version: number; // Version of the collection
        is_active: boolean; // Is the collection active
        schema: StaticDBSchemaType[]; // Schema of the collection
    }>({
        name: "", // Name of the collection
        description: "", // Description of the collection
        icon: "", // Icon of the collection
        version: 0, // Version of the collection
        is_active: true, // Is the collection active
        schema: [], // Schema of the collection
    });

    return (
        <div className='w-full h-full absolute'>

            <header className='flex flex-row items-center justify-start gap-2 w-full h-12 px-4 border-b'>
                <h1 className='text-lg font-semibold text-muted-foreground'>Create Collection</h1>
                <InfoCircledIcon className='w-5 h-5 text-muted-foreground cursor-pointer hover:text-white transition-colors' />
            </header>

            <ScrollArea className='h-[calc(100%-3rem)] w-full p-4' orientation='both'>
                <div className=''>

                    <div className='info border rounded-lg p-4'>
                        <div className={style.form} style={{
                            // @ts-ignore
                            '--form-input-max-width': '200px',
                        }}>
                            {/* Name */}
                            <div className={style.form_group}>
                                <Input
                                    id='name'
                                    name='name'
                                    type='text'
                                    placeholder=' '
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                                <label htmlFor='name'>Name</label>
                            </div>
                            {/* Icon */}
                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isPopoverOpen}
                                        className="w-full justify-between my-4"
                                    >
                                        {React.createElement(get_radix_icon(data.icon).component, {
                                            className: 'w-5 h-5 mr-2',
                                        })}
                                        {data.icon ? data.icon.replace(/([A-Z])/g, ' $1').trim() : 'Select Icon'}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search framework..." />
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup className=''>
                                            <ScrollArea className='w-full h-80' orientation='vertical'>
                                                {radix_icons.map((icon, index) => (
                                                    <CommandItem
                                                        key={index}
                                                        value={icon.id}
                                                        onSelect={(value) => {
                                                            setData({ ...data, icon: icon.id })
                                                            setIsPopoverOpen(false)
                                                        }}
                                                        className='flex flex-row items-center gap-4'
                                                    >
                                                        {React.createElement(icon.component, {
                                                            className: 'w-5 h-5 mr-2',
                                                        })}
                                                        {icon.name}
                                                    </CommandItem>
                                                ))}
                                            </ScrollArea>
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {/* Version */}
                            <div className={style.form_group}>
                                <Input
                                    id='version'
                                    name='version'
                                    type='number'
                                    placeholder=' '
                                    value={data.version}
                                    onChange={(e) => setData({ ...data, version: parseInt(e.target.value) })}
                                />
                                <label htmlFor='version'>Version</label>
                            </div>
                            {/* Description */}
                            <div className={`${style.form_group} col-span-full`}>
                                <textarea
                                    id='description'
                                    name='description'
                                    placeholder=' '
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    className='min-h-[100px] resize-y'
                                />
                                <label htmlFor='description'>Description</label>
                            </div>
                            {/* Is_active */}
                            <div className='col-span-full border rounded-lg px-4 py-2 flex flex-row gap-4 justify-between items-center'>
                                <div>
                                    <h3 className='text-lg font-semibold text-muted-foreground'>Set Status</h3>
                                    <p className='text-sm text-muted-foreground'>
                                        Set the status of this Collection.
                                        Inactive collection will not be surved to the client.
                                    </p>
                                </div>

                                <div className='flex flex-col items-center justify-center gap-1'>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData({ ...data, is_active: checked })}
                                    />
                                    {data.is_active ?
                                        <label className='text-sm text-green-500'>Active</label>
                                        :
                                        <label className='text-sm text-red-500'>Inactive</label>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='schema'></div>

                </div>
            </ScrollArea>

        </div>
    )
}