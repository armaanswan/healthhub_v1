import { Header, Sider, ThemedLayoutContextProvider } from "@refinedev/antd";
import { PropsWithChildren } from "react";
import { Grid, Layout as AntdLayout } from "antd";

export function MainLayout({ children }: PropsWithChildren) {
  const breakpoint = Grid.useBreakpoint();
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;

  return (
    <ThemedLayoutContextProvider>
      <AntdLayout hasSider style={{ minHeight: "100vh" }}>
        <Sider />
        <AntdLayout>
          <Header />
          <AntdLayout.Content
            style={{
              padding: isSmall ? 32 : 16,
            }}
          >
            {children}
          </AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
}
