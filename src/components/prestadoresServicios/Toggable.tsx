import React from 'react'



export const Toggable = ({children, EmptyTemplate, toogle}: {
  children: React.ReactNode,
  EmptyTemplate: React.ReactNode,
  toogle: boolean
}) => {
  if (toogle) {
    return (
      <>
        {children}
      </>
    )
  }
  return (
    <>
      {EmptyTemplate}
    </>
  )
}

