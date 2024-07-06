'use client';
import { cn } from '@/utilities/cn';
import React from 'react'
import Form from 'react-bootstrap/esm/Form';
import { IoSearchOutline } from "react-icons/io5";

type Props = {
  className?: string,
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined,
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined,
}

export default function Search(props: Props) {
  return (
    <form className={cn("flex relative items-center justify-center h-10", props.className)} onSubmit={props.onSubmit}>
      <Form.Control onChange={props.onChange} type="text" placeholder="Enter country..." value={props.value} />
      <button className='px-4 py-[9px] bg-emerald-300 transition-all rounded-r-md focus:outline-none hover:bg-emerald-400 h-full'>
        <IoSearchOutline />
      </button>
    </form>
  );
}
