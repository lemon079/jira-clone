import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import CreateWorkspaceModal from '@/components/workspace/CreateWorkspaceModal'
import CreateProjectModal from '@/components/projects/CreateProjectModal'
import React from 'react'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'
import EditTaskModal from '@/components/tasks/EditTaskModal'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const layout = ({ children }: DashboardLayoutProps) => {

    return (
        <div className='min-h-screen'>
            <CreateWorkspaceModal />
            <CreateProjectModal />
            <CreateTaskModal />
            <EditTaskModal />
            <div className='flex size-full'>
                <div className='fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto'>
                    <Sidebar />
                </div>
                <div className='lg:pl-[264px] w-full'>
                    <div className='mx-auto max-w-screen-2xl h-full'>
                        <Navbar />
                        <main className='h-full py-8 px-6 flex flex-col'>
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default layout