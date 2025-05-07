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
import { useCartStore } from "@/store/cart";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type TitleStatus = {
  [key: string]: boolean | TitleStatus;
};

type Item = { title: string; url: string; isActive?: boolean; items?: Item[] };

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: Item[];
  }[];
}) {
  const getAllTitleStatus = (items: Item[]) => {
    return items.reduce<TitleStatus>((acc, item) => {
      if (item.items?.length) {
        acc[item.title] = getAllTitleStatus(item.items);
      } else {
        acc[item.title] = item?.isActive || false;
      }
      return acc;
    }, {});
  };

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
      if (
        typeof newActiveItem[title] === "object" &&
        newActiveItem[title] !== null
      ) {
        (newActiveItem[title] as TitleStatus)[subTitle] = true;
      }
    } else {
      newActiveItem[title] = true;
    }

    setActiveItem(newActiveItem);
  };

  const cart = useCartStore((state) => state.cart);

  const { pathname } = useLocation();

  const path = pathname.split("/")[1]; // gets 'cart' from '/cart'

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={!!activeItem[item.title]}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={
                      path === item.title.toLowerCase() ||
                      !!(
                        typeof activeItem[item.title] === "boolean" &&
                        activeItem[item.title]
                      )
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
                    path === item.title.toLowerCase() ||
                    !!(
                      typeof activeItem[item.title] === "boolean" &&
                      activeItem[item.title]
                    )
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
                      <SidebarMenuSubButton asChild>
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
