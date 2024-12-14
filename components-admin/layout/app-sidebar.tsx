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

export default function AppSidebar({
  onPageChange
}: {
  onPageChange: (page: string) => void
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center gap-2 py-2 text-sidebar-accent-foreground'>
          <Image
            src='/images/ic_logo.svg'
            alt='Logo'
            width='48'
            height='48'
            className='relative'
          />
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold text-lg'>Plan Guru</span>
            <span className='truncate text-xs'>Admin Page</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(item => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo
              return item?.items && item?.items?.length > 0 ? (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    onClick={() => onPageChange(item.title)}
                  >
                    {item.icon && <Icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <ul>
                    {item.items.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          <Link
                            href={subItem.url}
                            onClick={() => onPageChange(subItem.title)}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </ul>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link
                      href={item.url}
                      onClick={() => onPageChange(item.title)}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>Footer Content</SidebarFooter>
    </Sidebar>
  )
}
