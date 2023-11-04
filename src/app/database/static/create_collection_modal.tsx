"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { StaticDBSchemaType, createDefaultSchemaFromType, schemaTypes } from '@/types/static-db';
import { BookmarkFilledIcon, CalendarIcon, CaretSortIcon, InfoCircledIcon, PlusIcon, UpdateIcon } from '@radix-ui/react-icons';
import React from 'react'
import style from "@/app/membership/roles/forms.module.scss";
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import radix_icons, { get_radix_icon } from '@/components/radix_icons';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { createStaticDB } from '@/functions/static_db';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Props = {}

export default function CreateCollectionModal({ }: Props) {

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [data, setData] = React.useState<{
        name: string; // Name of the collection
        description: string; // Description of the collection
        icon: string; // Icon of the collection
        version: number; // Version of the collection
        isCollection: boolean; // Is the collection or a document
        is_active: boolean; // Is the collection active
        schema: StaticDBSchemaType[]; // Schema of the collection
    }>({
        name: "", // Name of the collection
        description: "", // Description of the collection
        icon: "", // Icon of the collection
        version: 0, // Version of the collection
        isCollection: true, // Is the collection or a document
        is_active: true, // Is the collection active
        schema: [ // Example Schema with all types
            createDefaultSchemaFromType("number", "Version"),
            createDefaultSchemaFromType("string", "Name"),
            createDefaultSchemaFromType("long-string", "Description"),
            createDefaultSchemaFromType("rich-text", "Content"),
            createDefaultSchemaFromType("boolean", "Is Active"),
            // createDefaultSchemaFromType("time", "Time"),
            createDefaultSchemaFromType("date", "Created At"),
            // createDefaultSchemaFromType("datetime", "Updated At"),
            createDefaultSchemaFromType("user", "Created By"),
            createDefaultSchemaFromType("reference", "Reference"),
            createDefaultSchemaFromType("file", "File"),
            createDefaultSchemaFromType("select", "Select"),
            createDefaultSchemaFromType("multiselect", "Multi Select"),
            createDefaultSchemaFromType("array", "Tags"),
        ], // Schema of the collection
    });
    const [isPending, startTransition] = React.useTransition();
    const { toast } = useToast();

    function save() {
        // Check if the data is valid
        if (data.name.trim() === "") {
            toast({
                title: "Invalid Name",
                description: "Name cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        if (data.icon.trim() === "") {
            toast({
                title: "Invalid Icon",
                description: "Icon cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        if (data.description.trim() === "") {
            toast({
                title: "Invalid Description",
                description: "Description cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        if (data.version < 0) {
            toast({
                title: "Invalid Version",
                description: "Version cannot be negative.",
                variant: "destructive",
            });
            return;
        }
        if (data.schema.length === 0) {
            toast({
                title: "Invalid Schema",
                description: "Schema cannot be empty.",
                variant: "destructive",
            });
            return;
        }

        // Start the transition
        startTransition(async () => {
            const res = await createStaticDB(data, window.location.pathname);

            if (res.status === 200) {
                toast({
                    title: "Collection Created",
                    description: "Collection has been created successfully.",
                    variant: "default",
                });
                setIsDialogOpen(false);
            } else {
                toast({
                    title: "Failed to Create Collection",
                    description: res.message,
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className='h-full px-2 flex gap-2 items-center justify-center'
                    variant="outline">
                    <PlusIcon className='w-4 h-4' />
                    <span>Create Collection</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={`rounded-lg w-full max-w-[calc(100%-2rem)] lg:max-w-4xl h-full max-h-[calc(100%-2rem)] p-0`}>
                <div className='w-full h-full absolute'>

                    <header className='flex flex-row items-center justify-start gap-2 w-full h-12 px-4 border-b'>
                        <h1 className='text-lg font-semibold text-muted-foreground'>Create Collection</h1>
                        <InfoCircledIcon className='w-5 h-5 text-muted-foreground cursor-pointer hover:text-white transition-colors' />
                    </header>

                    <ScrollArea className='h-[calc(100%-3rem)] w-full p-4' orientation='both'>
                        <div className=''>

                            <div className='info'>
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
                                    {/* Is Collection */}
                                    <div className='col-span-full border rounded-lg px-4 py-2 mb-2 flex flex-row gap-4 justify-between items-center'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-muted-foreground'>Is it a Collection?</h3>
                                            <p className='text-sm text-muted-foreground'>
                                                A collection is a group of documents.
                                                A document is a group of fields.
                                            </p>
                                        </div>

                                        <div className='flex flex-col items-center justify-center gap-1'>
                                            <Switch
                                                checked={data.isCollection}
                                                onCheckedChange={(checked) => setData({ ...data, isCollection: checked })}
                                            />
                                            {data.isCollection ?
                                                <label className='text-sm text-green-500'>Collection</label>
                                                :
                                                <label className='text-sm text-red-500'>Document</label>
                                            }
                                        </div>
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

                            <div className='schema mt-4 border rounded-lg'>

                                <div className='px-4 py-2 border-b flex flex-row items-center justify-between sticky top-0 bg-background z-10'>
                                    <h2 className='text-lg font-semibold text-muted-foreground'>
                                        Schema Definition
                                    </h2>

                                    <DropdownMenu modal>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='outline' className=''>
                                                <PlusIcon className='w-4 h-4 mr-2' />
                                                Add Field
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className='h-60'>
                                            <ScrollArea className='w-full h-full' orientation='vertical'>
                                                <DropdownMenuLabel>
                                                    Select Field Type
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {schemaTypes.map((type, index) => (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        className='capitalize'
                                                        onClick={() => {
                                                            setData({
                                                                ...data,
                                                                schema: [
                                                                    ...data.schema,
                                                                    createDefaultSchemaFromType(type, `Field ${data.schema.length + 1}`),
                                                                ],
                                                            });
                                                        }}
                                                    >
                                                        {type}
                                                    </DropdownMenuItem>
                                                ))}
                                            </ScrollArea>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <SchemaForm schema={data.schema} setSchema={(schema) => setData({ ...data, schema })} />

                            </div>

                            <div className='actions flex flex-row items-center justify-end gap-2 mt-4 mb-2'>
                                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button
                                    variant='default'
                                    className='bg-[hsl(168,76%,42%)] hover:bg-[hsl(168,76%,38%)] text-white'
                                    disabled={isPending}
                                    onClick={save}
                                >
                                    {isPending ?
                                        <UpdateIcon className='w-4 h-4 mr-2 animate-spin' />
                                        :
                                        <BookmarkFilledIcon className='w-4 h-4 mr-2' />
                                    }
                                    Create
                                </Button>
                            </div>

                        </div>
                    </ScrollArea>

                </div>
            </DialogContent>
        </Dialog>
    )
}

function SchemaForm({ schema, setSchema }: { schema: StaticDBSchemaType[]; setSchema: (schema: StaticDBSchemaType[]) => void }) {

    return (
        <div className='px-4 py-2'>
            {schema.map((field, index) => (
                // Each Field;
                // Setup the form suitable for each type
                // Some values are common for all types
                // Some values are specific to each type, might be undefined

                <div key={index} className='relative border rounded-lg px-4 py-2 pt-3 my-2 mt-4'>
                    <p className={`text-base font-semibold text-muted-foreground capitalize
                        absolute left-0 top-0 -translate-y-1/2 px-1 mx-2 origin-top-left
                        bg-background pointer-events-none`}>
                        {field.type}
                    </p>

                    <div className={``}>
                        <div className='w-full flex flex-wrap gap-x-4 items-start'>
                            {/* Name of the Field */}
                            <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`field_name-${index}`}
                                    name={`field_name-${index}`}
                                    type='text'
                                    placeholder=' '
                                    value={field.name}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].name = e.target.value;
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`field_name-${index}`}>Field Name</label>
                            </div>

                            {/* Default Value; Will be different for each type */}
                            {/* For numbers */}
                            {["number"].includes(field.type) && <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`default-${index}`}
                                    name={`default-${index}`}
                                    type='number'
                                    placeholder=' '
                                    value={field.default as number}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].default = parseInt(e.target.value);
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`default-${index}`}>Default Value</label>
                            </div>}
                            {/* For strings */}
                            {["string"].includes(field.type) && <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`default-${index}`}
                                    name={`default-${index}`}
                                    type='text'
                                    placeholder=' '
                                    value={field.default as string}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].default = e.target.value;
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`default-${index}`}>Default Value</label>
                            </div>}
                            {/* For long-strings */}
                            {["long-string"].includes(field.type) && <div className={`${style.form_group} flex-auto flex-grow w-full`}>
                                <textarea
                                    id={`default-${index}`}
                                    name={`default-${index}`}
                                    placeholder=' '
                                    value={field.default as string}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].default = e.target.value;
                                        setSchema(newSchema);
                                    }}
                                    className='min-h-[100px] resize-y'
                                />
                                <label htmlFor={`default-${index}`}>Default Value</label>
                            </div>}
                            {/* For rich-texts */}
                            {["rich-text"].includes(field.type) && <div className={`${style.form_group} flex-auto flex-grow w-full`}>
                                <textarea
                                    id={`default-${index}`}
                                    name={`default-${index}`}
                                    placeholder=' '
                                    value={field.default as string}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].default = e.target.value;
                                        setSchema(newSchema);
                                    }}
                                    className='min-h-[100px] resize-y'
                                />
                                <label htmlFor={`default-${index}`}>Default Value</label>
                            </div>}
                            {/* For Booleans */}
                            {["boolean"].includes(field.type) && <div className={`flex-1 flex flex-row items-center justify-between gap-1 min-w-[180px] border rounded-lg px-4 py-2 mt-4 mb-2`}>
                                <label>Defult Value: {field.default ?
                                    <span className='text-sm text-green-500'>True</span>
                                    :
                                    <span className='text-sm text-red-500'>False</span>
                                }</label>
                                <Switch
                                    checked={field.default as boolean}
                                    onCheckedChange={(checked) => {
                                        const newSchema = [...schema];
                                        newSchema[index].default = checked;
                                        setSchema(newSchema);
                                    }}
                                />
                            </div>}
                            {/* For Date */}
                            {["date"].includes(field.type) && <Popover modal>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "flex-1 justify-start text-left font-normal mb-2 mt-4",
                                            !field.default && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span className='font-semibold'>Default Date:</span>&nbsp;&nbsp;
                                        {field.default ? format(field.default as number, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.default ? new Date(field.default as number) : undefined}
                                        onSelect={(selected) => {
                                            if (!selected) return;
                                            const newSchema = [...schema];
                                            newSchema[index].default = selected.getTime();
                                            setSchema(newSchema);
                                        }}
                                        initialFocus
                                        fromDate={field.min ? new Date(field.min) : undefined}
                                        toDate={field.max ? new Date(field.max) : undefined}
                                    />
                                </PopoverContent>
                            </Popover>}
                        </div>

                        {/* For Numbers */}
                        {/* Default, Max, Min */}
                        {["number"].includes(field.type) && <div className='w-full flex flex-wrap gap-x-4'>
                            <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`min-${index}`}
                                    name={`min-${index}`}
                                    type='number'
                                    placeholder=' '
                                    value={field.min}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].min = parseInt(e.target.value);
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`min-${index}`}>Min</label>
                            </div>
                            <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`max-${index}`}
                                    name={`max-${index}`}
                                    type='number'
                                    placeholder=' '
                                    value={field.max}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].max = parseInt(e.target.value);
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`max-${index}`}>Max</label>
                            </div>
                        </div>}

                        {/* For String, Long String & Rich Text */}
                        {/* Default, Max Length & Min Length */}
                        {["string", "long-string", "rich-text"].includes(field.type) && <div className='w-full flex flex-wrap gap-4'>
                            <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`min_length-${index}`}
                                    name={`min_length-${index}`}
                                    type='number'
                                    placeholder=' '
                                    value={field.min_length}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].min_length = parseInt(e.target.value);
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`min_length-${index}`}>Min Length</label>
                            </div>
                            <div className={`${style.form_group} flex-1`}>
                                <Input
                                    id={`max_length-${index}`}
                                    name={`max_length-${index}`}
                                    type='number'
                                    placeholder=' '
                                    value={field.max_length}
                                    onChange={(e) => {
                                        const newSchema = [...schema];
                                        newSchema[index].max_length = parseInt(e.target.value);
                                        setSchema(newSchema);
                                    }}
                                />
                                <label htmlFor={`max_length-${index}`}>Max Length</label>
                            </div>
                        </div>}

                        {/* For Date */}
                        {/* Date Range */}
                        {["date"].includes(field.type) && <div className='w-full flex flex-wrap gap-x-4 items-start'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "flex-auto flex-grow w-full justify-start text-left font-normal mb-2 mt-4",
                                            (!field.max && !field.min) && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span className='font-semibold'>Renge for Date:</span>&nbsp;&nbsp;
                                        {!field.max && !field.min && <span>Pick a date</span>}
                                        {field.max && field.min && `${format(field.min, "PPP")} - ${format(field.max, "PPP")}`}
                                        {field.max && !field.min && `Before ${format(field.max, "PPP")}`}
                                        {!field.max && field.min && `After ${format(field.min, "PPP")}`}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.min ? new Date(field.min) : undefined}
                                        selected={{
                                            from: field.min ? new Date(field.min) : field.max ? new Date(field.max) : new Date(),
                                            to: field.max ? new Date(field.max) : undefined,
                                        }}
                                        onSelect={(selected) => {
                                            if (!selected || !selected.from || !selected.to) return;
                                            const newSchema = [...schema];
                                            newSchema[index].min = selected.from.getTime();
                                            newSchema[index].max = selected.to.getTime();
                                            setSchema(newSchema);
                                        }}
                                        numberOfMonths={2}
                                        min={2}
                                    />
                                </PopoverContent>
                            </Popover>

                            {/* Reset min */}
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "flex-1 justify-start text-left font-normal mb-2 mt-4",
                                )}
                                disabled={!field.min}
                                onClick={() => {
                                    const newSchema = [...schema];
                                    newSchema[index].min = undefined;
                                    setSchema(newSchema);
                                }}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className='font-semibold'>Reset Min Date</span>
                            </Button>

                            {/* Reset max */}
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "flex-1 justify-start text-left font-normal mb-2 mt-4",
                                )}
                                disabled={!field.max}
                                onClick={() => {
                                    const newSchema = [...schema];
                                    newSchema[index].max = undefined;
                                    setSchema(newSchema);
                                }}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className='font-semibold'>Reset Max Date</span>
                            </Button>
                        </div>}

                        {/* Required & Unique */}
                        <div className='flex flex-row flex-wrap items-center justify-end gap-4 col-span-full mt-4'>
                            {/* Required */}
                            <div className='flex flex-row items-center justify-between gap-1 min-w-[180px] border rounded-lg px-4 py-2'>
                                {field.required ?
                                    <label className='text-sm text-green-500'>Required</label>
                                    :
                                    <label className='text-sm text-red-500'>Optional</label>
                                }
                                <Switch
                                    checked={field.required}
                                    onCheckedChange={(checked) => {
                                        const newSchema = [...schema];
                                        newSchema[index].required = checked;
                                        setSchema(newSchema);
                                    }}
                                />
                            </div>
                            {/* Unique */}
                            <div className='flex flex-row items-center justify-between gap-1 min-w-[180px] border rounded-lg px-4 py-2'>
                                {field.unique ?
                                    <label className='text-sm text-green-500'>Unique</label>
                                    :
                                    <label className='text-sm text-red-500'>Non Unique</label>
                                }
                                <Switch
                                    checked={field.unique}
                                    onCheckedChange={(checked) => {
                                        const newSchema = [...schema];
                                        newSchema[index].unique = checked;
                                        setSchema(newSchema);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
