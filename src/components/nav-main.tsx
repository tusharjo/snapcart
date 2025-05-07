import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const getAllTitleStatus = (items) => {
    return items.reduce((acc, item) => {
      if (item.items?.length) {
        acc[item.title] = getAllTitleStatus(item.items);
      } else {
        acc[item.title] = item?.isActive || false;
      }
      return acc;
    }, {});
  };

  console.log(getAllTitleStatus(items), items, "getAllTitleWithStatus");

  // set sidebar items active
  const [activeItem, setActiveItem] = useState(getAllTitleStatus(items));

  const handleItemClick = (title: string, subTitle?: string) => {
    const newActiveItem = getAllTitleStatus(items);

    // Reset all values to false
    for (const key in newActiveItem) {
      const value = newActiveItem[key];
      if (value && typeof value === "object") {
        for (const subKey in value) {
          value[subKey] = false;
        }
      } else {
        newActiveItem[key] = false;
      }
    }

    // Set the clicked item to true
    if (subTitle) {
      newActiveItem[title][subTitle] = true;
    } else {
      newActiveItem[title] = true;
    }

    setActiveItem(newActiveItem);
  };

  const cart = useCartStore((state) => state.cart);

  const { pathname } = useLocation();

  const path = pathname.split("/")[1]; // gets 'cart' from '/cart'

  console.log(activeItem, path, "activeItemactiveItemactiveItem");

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={activeItem}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={
                      path === item.title.toLowerCase() ||
                      activeItem[item.title]
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={
                    path === item.title.toLowerCase() || activeItem[item.title]
                  }
                >
                  {item.icon && <item.icon />}
                  <Link
                    to={item.url}
                    onClick={() => handleItemClick(item.title)}
                  >
                    <span>
                      {item.title} {item.title === "Cart" && `(${cart.length})`}
                    </span>
                  </Link>
                </SidebarMenuButton>
              )}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={activeItem[item.title]?.[subItem.title]}
                      >
                        <Link
                          to={subItem.url}
                          className="flex w-full h-full"
                          onClick={() =>
                            handleItemClick(item.title, subItem.title)
                          }
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
