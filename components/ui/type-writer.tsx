"use client";   
import { lookup } from 'dns'
import React from 'react'
import Typewriter from 'typewriter-effect'

type Props = {}

const TypeWriterTitle = (props: Props) => {
  return (
    <Typewriter options={{
        loop: true,
    }}
    onInit={(typewriter) =>{
        typewriter.typeString('Create Notes')
        .pauseFor(1000)
        .deleteAll()
        .typeString('Duplicate Note')
        .pauseFor(1000)
        .deleteAll()
        .typeString('Saving Images')
        .start()
    }} />
  )
}

export default TypeWriterTitle