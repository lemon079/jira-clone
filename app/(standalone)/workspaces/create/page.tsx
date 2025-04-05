import CreateWorkspaceForm from '@/components/workspace/CreateWorkspaceForm'
import React from 'react'

const page = () => {
  return (
    <div className='w-full lg:max-w-lg'>
      <CreateWorkspaceForm formType='standalone' />
    </div>
  )
}

export default page