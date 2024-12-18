import {
  Banknote,
  Calendar,
  ChevronDown,
  ChevronUp,
  CirclePercent,
  Home,
  Inbox,
  MessageCircle,
  Search,
  Settings,
  Shapes,
  User,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../../@components/ui/sidebar";
import { DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { DropdownMenuContent } from "@components/ui/dropdown-menu";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { DropdownMenu } from "@components/ui/dropdown-menu";
import { CollapsibleTrigger } from "@components/ui/collapsible";
import { CollapsibleContent } from "@components/ui/collapsible";
import { Collapsible } from "@components/ui/collapsible";
import { Category } from "@mui/icons-material";
import { useAuth } from "context/AuthContext";

export function AppSidebar() {
  const { logout } = useAuth();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  console.log("🚀 ~ AppSidebar ~ user:", user);
  return (
    <Sidebar className="bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton>
                <Home />
                <a href="/admin/dashboard">Dashboard</a>
              </SidebarMenuButton>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Shapes />
                      <span>Sản phẩm</span>
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <a href="/admin/products">Danh sách</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="/admin/products/create">Thêm</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="/admin/products/update">Sửa</a>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <User />
                      <span>Người dùng</span>
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <a href="/admin/users">Danh sách</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="/admin/users/create">Thêm</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="/admin/users/update">Sửa</a>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Category />
                      <span>Danh mục</span>
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <a href="/admin/categories">Danh sách</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="/admin/categories/create">Thêm</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="/admin/categories/update">Sửa</a>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuButton>
                <CirclePercent />
                <a href="/admin/orders">Đơn hàng</a>
              </SidebarMenuButton>
              <SidebarMenuButton>
                <MessageCircle />
                <a href="/admin/comments">Bình luận</a>
              </SidebarMenuButton>
              <SidebarMenuButton>
                <CirclePercent />
                <a href="/admin/discounts">Chương trình khuyến mãi</a>
              </SidebarMenuButton>
              <SidebarMenuButton>
                <Banknote />
                <a href="/admin/payments">Lịch sử thanh toán</a>
              </SidebarMenuButton>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Settings />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <a href="#profile">Profile</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="#security">Security</a>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <a href="#notifications">Notifications</a>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span onClick={logout}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
