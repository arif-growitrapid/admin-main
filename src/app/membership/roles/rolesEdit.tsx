"use client";

import { Input } from '@/components/ui/input'
import { roleType } from '@/types/auth'
import React from 'react'
import style from "./forms.module.scss";
import { Switch } from '@/components/ui/switch';
import { detailed_permissions } from '@/types/permissions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreateRole, UpdateRole } from '@/functions/roles';

export default function RoleEdit({
    initial_data,
    isCreating,
    close,
}: {
    initial_data?: roleType,
    isCreating?: boolean,
    close?: () => void,
}) {
    const empty_data: roleType = {
        _id: '0',
        name: '',
        description: '',
        permissions: [],
        rank: 0,
        status: 'active',
        createdAt: new Date(),
        createdBy: '0',
        updatedAt: new Date(),
        updatedBy: '0',
    }

    const { toast } = useToast();
    const [data, setData] = React.useState<roleType>(isCreating ? empty_data : initial_data || empty_data);
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(() => {
        setData(isCreating ? empty_data : initial_data || empty_data);
    }, [initial_data]);

    async function save() {
        if (data._id.toString() === '1' || data._id.toString() === '2') {
            toast({
                title: "Cannot make changes in this role",
                description: "This role is required for the system to function properly.",
                variant: 'destructive'
            });
            return;
        }

        startTransition(async () => {
            if (isCreating) {
                const res = await CreateRole({
                    name: data.name,
                    description: data.description,
                    permissions: data.permissions,
                    rank: data.rank,
                }, window.location.pathname);

                close?.();
                toast({
                    title: res.status === 200 ? "Role created successfully" : "Error creating role",
                    description: res.status === 200 ? "The role was created successfully." : "There was an error creating the role.",
                    variant: res.status === 200 ? 'default' : 'destructive'
                });
            } else {
                const res = await UpdateRole({
                    id: data._id.toString(),
                    name: data.name,
                    description: data.description,
                    permissions: data.permissions,
                    rank: data.rank,
                    status: data.status,
                }, window.location.pathname);

                close?.();
                toast({
                    title: res.status === 200 ? "Role updated successfully" : "Error updating role",
                    description: res.status === 200 ? "The role was updated successfully." : "There was an error updating the role.",
                    variant: res.status === 200 ? 'default' : 'destructive'
                });
            }
        });
    }

    return (
        <div className='w-full h-auto'>

            {isPending &&
                <div className='w-full h-full fixed top-0 left-0 flex flex-row justify-center items-center bg-black bg-opacity-50 z-50'>
                    <div className='w-12 h-12 animate-spin'>
                        <svg className='w-full h-full text-foreground' viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            }

            <h2 className='text-xl font-semibold text-muted-foreground'>{isCreating ? "Create" : "Edit"} Role</h2>

            <div className={style.form} style={{
                // @ts-ignore
                '--form-input-max-width': '200px',
            }}>

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

                <div className={style.form_group}>
                    <Input
                        id='rank'
                        name='rank'
                        type='number'
                        placeholder=' '
                        value={data.rank}
                        onChange={(e) => setData({ ...data, rank: parseInt(e.target.value) })}
                    />
                    <label htmlFor='rank'>Rank</label>
                </div>

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

                <div className='col-span-full border rounded-lg px-4 py-2 flex flex-row gap-4 justify-between items-center'>
                    <div>
                        <h3 className='text-lg font-semibold text-muted-foreground'>Set Status</h3>
                        <p className='text-sm text-muted-foreground'>
                            Set the status of this role.
                            Inactive roles will not be available for assignment.
                        </p>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-1'>
                        <Switch
                            checked={data.status === 'active'}
                            onCheckedChange={(checked) => setData({ ...data, status: checked ? 'active' : 'inactive' })}
                        />
                        {data.status === 'active' ?
                            <label className='text-sm text-green-500'>Active</label>
                            :
                            <label className='text-sm text-red-500'>Inactive</label>
                        }
                    </div>
                </div>

                <div className='col-span-full border rounded-lg px-4 py-2 mt-4'>
                    <div>
                        <h3 className='text-lg font-semibold text-muted-foreground'>Add/Remove Permissions</h3>
                        <p className='text-sm text-muted-foreground'>
                            Add or remove permissions for this role.
                            Permissions are used to control access to various features of the application.
                        </p>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                        {detailed_permissions.map((permission, index) => (
                            <div key={index} className={`flex flex-row gap-4 items-center
                                border rounded-lg px-4 py-2
                            `}>
                                <Switch
                                    checked={data.permissions.includes(permission.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData({ ...data, permissions: [...data.permissions, permission.id] })
                                        } else {
                                            setData({ ...data, permissions: [...data.permissions.filter((p) => p !== permission.id)] })
                                        }
                                    }}
                                />
                                <label className={`text-sm ${data.permissions.includes(permission.id) ? "text-foreground" : "text-muted-foreground"}`}>{permission.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save / Create */}
                <div className='col-span-full mt-4'>
                    <Button className='w-full' onClick={save}>
                        {isCreating ? 'Create' : 'Save'}
                    </Button>
                </div>

            </div>
        </div>
    )
}