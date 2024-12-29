import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { navItems } from '@/constants/data'
import { Icons } from '../icons'
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from 'lucide-react'

export default function AppSidebar({
  onPageChange
}: {
  onPageChange: (page: string) => void
}) {
  const pathname = usePathname()

  return (
    <Sidebar 
      collapsible='icon'
      className="border-r border-slate-200"
    >
      <SidebarHeader className="px-4 py-6 border-b border-slate-200">
        <div className='flex items-center gap-3'>
          <Image
            src='/images/ic_logo.svg'
            alt='Logo'
            width='48'
            height='48'
            className='rounded-xl'
          />
          <div className='grid flex-1 text-left'>
            <span className='text-lg font-bold text-slate-900'>Plan Guru</span>
            <span className='text-xs text-slate-500'>Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-medium px-4 py-2 text-slate-500">
            Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const isActive = pathname === item.url;
              
              return item?.items && item?.items?.length > 0 ? (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    onClick={() => onPageChange(item.title)}
                    className={cn(
                      "w-full rounded-md transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                      isActive && "bg-green-500 text-white hover:bg-green-500 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <ul className="pl-4 mt-1 space-y-1">
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                              "rounded-md transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                              isSubActive && "bg-green-500 text-white hover:bg-green-500 hover:text-white"
                            )}
                          >
                            <Link
                              href={subItem.url}
                              onClick={() => onPageChange(subItem.title)}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </ul>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "w-full rounded-md transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                      isActive && "bg-green-500 text-white hover:bg-green-500 hover:text-white"
                    )}
                  >
                    <Link
                      href={item.url}
                      onClick={() => onPageChange(item.title)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
