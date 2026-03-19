import { attrs } from "@pyreon/attrs"
import { Col, Container, Row } from "@pyreon/coolgrid"
import { Element, List, Text } from "@pyreon/elements"
import {
  useClickOutside,
  useColorScheme,
  useDebouncedValue,
  useElementSize,
  useFocus,
  useHover,
  useIntersection,
  useKeyboard,
  useMediaQuery,
  useReducedMotion,
  useScrollLock,
  useToggle,
  useWindowResize,
} from "@pyreon/hooks"
import { fade, kinetic, slideDown, slideUp } from "@pyreon/kinetic"
import {
  compose,
  fadeDown,
  fadeUp,
  scaleUp,
  withDuration,
  withEasing,
} from "@pyreon/kinetic-presets"
import { computed, signal } from "@pyreon/reactivity"
import { rocketstyle } from "@pyreon/rocketstyle"
import { config } from "@pyreon/ui-core"

const { styled, keyframes } = config

// ─── Theme ───────────────────────────────────────────────────────────────────

const lightTheme: Record<string, string> = {
  "--bg": "#f8f9fa",
  "--bg-card": "#ffffff",
  "--bg-surface": "#f1f3f5",
  "--text": "#212529",
  "--text-muted": "#868e96",
  "--border": "#dee2e6",
  "--primary": "#228be6",
  "--primary-hover": "#1c7ed6",
  "--success": "#40c057",
  "--danger": "#fa5252",
  "--warning": "#fab005",
  "--shadow": "0 1px 3px rgba(0,0,0,0.08)",
  "--shadow-lg": "0 8px 24px rgba(0,0,0,0.12)",
  "--radius": "8px",
}

const darkTheme: Record<string, string> = {
  "--bg": "#1a1b1e",
  "--bg-card": "#25262b",
  "--bg-surface": "#2c2e33",
  "--text": "#c1c2c5",
  "--text-muted": "#909296",
  "--border": "#373a40",
  "--primary": "#4dabf7",
  "--primary-hover": "#74c0fc",
  "--success": "#69db7c",
  "--danger": "#ff6b6b",
  "--warning": "#ffd43b",
  "--shadow": "0 1px 3px rgba(0,0,0,0.3)",
  "--shadow-lg": "0 8px 24px rgba(0,0,0,0.5)",
  "--radius": "8px",
}

// ─── Styled primitives (styler) ─────────────────────────────────────────────

const Page = styled("div")`
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  transition: background 0.3s, color 0.3s;
  padding-bottom: 64px;
`

const Header = styled("header")`
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled("h1")`
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.5px;
`

const Section = styled("section")`
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const SectionTitle = styled("h2")`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
`

const SectionDesc = styled("p")`
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
`

const Card = styled("div")`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
  transition: box-shadow 0.2s, transform 0.2s;
`

const Badge = styled("span")`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`

const Divider = styled("hr")`
  border: none;
  border-top: 1px solid var(--border);
  margin: 40px 0;
`

const Code = styled("code")`
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: "SF Mono", Consolas, monospace;
`

const FlexRow = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const _Spinner = styled("div")`
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin.toString()} 0.8s linear infinite;
`

const Btn = styled("button")`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  outline: none;
`

// ─── Kinetic animations ─────────────────────────────────────────────────────

const FadeIn = kinetic("div").preset(fade)
const SlideUp = kinetic("div").preset(slideUp)
const SlideDown = kinetic("div").preset(slideDown)

// Composed preset: fade up + scale with custom duration
const heroPreset = compose(fadeUp, scaleUp)
const heroAnimation = withDuration(withEasing(heroPreset, "ease-out"), 600)
const HeroFade = kinetic("div").preset(heroAnimation)

// Notification preset
const notifPreset = withDuration(fadeDown, 300)
const NotifFade = kinetic("div").preset(notifPreset)

// ─── Base button component ───────────────────────────────────────────────────

const BaseButton = (props: {
  label?: string | undefined
  children?: any
  style?: any
  onClick?: (() => void) | undefined
  type?: string | undefined
  [key: string]: any
}) => (
  <Btn
    type={(props.type ?? "button") as "button" | "submit" | "reset"}
    style={props.style}
    onClick={props.onClick}
  >
    {props.children ?? props.label}
  </Btn>
)

// ─── Attrs components ────────────────────────────────────────────────────────

const PrimaryButton = attrs({ name: "PrimaryButton", component: BaseButton }).attrs({
  style: { background: "var(--primary)", color: "#fff" },
} as any)

const DangerButton = attrs({ name: "DangerButton", component: BaseButton }).attrs({
  style: { background: "var(--danger)", color: "#fff" },
} as any)

const GhostButton = attrs({ name: "GhostButton", component: BaseButton }).attrs({
  style: {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
} as any)

// ─── Rocketstyle components ─────────────────────────────────────────────────

const RsButton = rocketstyle()({ name: "RsButton", component: BaseButton })
  .attrs({ type: "button" })
  .theme({
    bgColor: "var(--primary)",
    color: "#fff",
    hover: { bgColor: "var(--primary-hover)" },
  })
  .states({
    success: { bgColor: "var(--success)", color: "#fff" },
    danger: { bgColor: "var(--danger)", color: "#fff" },
    warning: { bgColor: "var(--warning)", color: "#000" },
  })
  .sizes({
    sm: { px: 8, py: 4, fs: 12 },
    md: { px: 16, py: 8, fs: 14 },
    lg: { px: 24, py: 12, fs: 16 },
  })
  .styles((({ $rocketstyle: t }: any) => ({
    style: {
      background: t.bgColor,
      color: t.color,
      paddingLeft: `${t.px ?? 16}px`,
      paddingRight: `${t.px ?? 16}px`,
      paddingTop: `${t.py ?? 8}px`,
      paddingBottom: `${t.py ?? 8}px`,
      fontSize: `${t.fs ?? 14}px`,
    },
  })) as any)

const RsBadge = rocketstyle()({ name: "RsBadge", component: Badge })
  .theme({ bgColor: "var(--primary)", color: "#fff" })
  .states({
    success: { bgColor: "var(--success)", color: "#fff" },
    danger: { bgColor: "var(--danger)", color: "#fff" },
    warning: { bgColor: "var(--warning)", color: "#000" },
  })
  .styles((({ $rocketstyle: t }: any) => ({
    style: { background: t.bgColor, color: t.color },
  })) as any)

// ─── Notification system ─────────────────────────────────────────────────────

type Notification = {
  id: number
  message: string
  type: "info" | "success" | "danger"
}

let notifId = 0
const notifications = signal<Notification[]>([])

function addNotification(message: string, type: Notification["type"] = "info") {
  const id = ++notifId
  notifications.set([...notifications(), { id, message, type }])
  setTimeout(() => removeNotification(id), 4000)
}

function removeNotification(id: number) {
  notifications.set(notifications().filter((n) => n.id !== id))
}

// ─── App ─────────────────────────────────────────────────────────────────────

export function App() {
  // Theme (useColorScheme + useToggle)
  const systemScheme = useColorScheme()
  const darkMode = useToggle(false)
  const theme = computed(() => (darkMode.value() ? darkTheme : lightTheme))

  // Responsive (useWindowResize + useMediaQuery + useReducedMotion)
  const windowSize = useWindowResize()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const reducedMotion = useReducedMotion()

  // Search with debounce (useDebouncedValue)
  const searchInput = signal("")
  const debouncedSearch = useDebouncedValue(() => searchInput(), 300)

  // Tabs
  const activeTab = signal<"dashboard" | "components" | "hooks">("dashboard")

  // Scroll lock + modal (useScrollLock + useToggle)
  const scrollLock = useScrollLock()
  const modalOpen = useToggle(false)

  // Keyboard shortcuts (useKeyboard)
  useKeyboard(
    "Escape",
    () => {
      if (modalOpen.value()) {
        modalOpen.setFalse()
        scrollLock.unlock()
      }
    },
    undefined,
  )

  useKeyboard(
    "n",
    (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return
      addNotification("Keyboard shortcut triggered!", "info")
    },
    undefined,
  )

  // Section visibility (useIntersection)
  let heroRef: HTMLElement | null = null
  const heroEntry = useIntersection(() => heroRef, { threshold: 0.5 })
  const _heroVisible = computed(
    () => (heroEntry() as IntersectionObserverEntry | null)?.isIntersecting ?? true,
  )

  // Dashboard data
  const stats = [
    { label: "Components", value: "10", change: "+2", trend: "up" },
    { label: "Hooks", value: "25+", change: "+5", trend: "up" },
    { label: "Presets", value: "122", change: "stable", trend: "flat" },
    { label: "Bundle", value: "~8kb", change: "-12%", trend: "down" },
  ]

  const recentItems = [
    { name: "Button", pkg: "rocketstyle", status: "stable" },
    { name: "Element", pkg: "elements", status: "stable" },
    { name: "fade", pkg: "kinetic", status: "stable" },
    { name: "useHover", pkg: "hooks", status: "stable" },
    { name: "Container", pkg: "coolgrid", status: "stable" },
    { name: "styled", pkg: "styler", status: "stable" },
  ]

  const filteredItems = computed(() => {
    const q = debouncedSearch().toLowerCase()
    if (!q) return recentItems
    return recentItems.filter(
      (item) => item.name.toLowerCase().includes(q) || item.pkg.toLowerCase().includes(q),
    )
  })

  return (
    <Page style={theme}>
      {/* ── Header ──────────────────────────────────────── */}
      <Header>
        <FlexRow>
          <Logo>Pyreon UI</Logo>
          <Badge style={{ background: "var(--primary)", color: "#fff" }}>showcase</Badge>
        </FlexRow>
        <FlexRow>
          <Code>{() => `${windowSize().width}x${windowSize().height}`}</Code>
          <Badge
            style={() => ({
              background: isMobile() ? "var(--warning)" : "var(--success)",
              color: isMobile() ? "#000" : "#fff",
            })}
          >
            {() => (isMobile() ? "mobile" : "desktop")}
          </Badge>
          <Badge
            style={() => ({
              background: reducedMotion() ? "var(--danger)" : "var(--bg-surface)",
              color: reducedMotion() ? "#fff" : "var(--text)",
            })}
          >
            {() => (reducedMotion() ? "reduced motion" : "animations on")}
          </Badge>
          <Btn
            type="button"
            style={{
              background: "var(--bg-surface)",
              color: "var(--text)",
            }}
            onClick={() => darkMode.toggle()}
          >
            {() => (darkMode.value() ? "Light" : "Dark")}
          </Btn>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {() => `System: ${systemScheme()}`}
          </span>
        </FlexRow>
      </Header>

      {/* ── Notifications (kinetic + hooks) ─────────────── */}
      <div
        style={{
          position: "fixed",
          top: "72px",
          right: "16px",
          zIndex: "200",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "320px",
        }}
      >
        {() =>
          notifications().map((notif) => {
            const colors: Record<string, string> = {
              info: "var(--primary)",
              success: "var(--success)",
              danger: "var(--danger)",
            }
            return (
              <NotifFade
                key={notif.id}
                appear
                show={() => true}
                style={{
                  background: "var(--bg-card)",
                  border: `2px solid ${colors[notif.type]}`,
                  borderRadius: "8px",
                  padding: "12px 16px",
                  boxShadow: "var(--shadow-lg)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: colors[notif.type],
                    flexShrink: "0",
                  }}
                />
                <span style={{ flex: "1" }}>{notif.message}</span>
                <button
                  type="button"
                  onClick={() => removeNotification(notif.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    fontSize: "16px",
                  }}
                >
                  x
                </button>
              </NotifFade>
            )
          })
        }
      </div>

      {/* ── Hero (kinetic compose + intersection) ───────── */}
      <div
        // @ts-expect-error -- Pyreon supports callback refs at runtime
        ref={(el: HTMLElement) => {
          heroRef = el
        }}
      >
        <HeroFade appear show={() => true}>
          <Section>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <SectionTitle style={{ fontSize: "36px", marginBottom: "16px" }}>
                Full-Stack UI System
              </SectionTitle>
              <SectionDesc
                style={{
                  fontSize: "16px",
                  maxWidth: "600px",
                  margin: "0 auto 24px",
                }}
              >
                All 10 packages working together: styling, animations, responsive grids, hooks,
                elements, and design-system primitives.
              </SectionDesc>
              <FlexRow style={{ justifyContent: "center" }}>
                {/* @ts-expect-error -- attrs built types lose component prop types */}
                <PrimaryButton
                  onClick={() => addNotification("Welcome to the showcase!", "success")}
                >
                  <span>Try notification</span>
                </PrimaryButton>
                {/* @ts-expect-error -- attrs built types lose component prop types */}
                <GhostButton
                  onClick={() => {
                    modalOpen.setTrue()
                    scrollLock.lock()
                  }}
                >
                  <span>Open modal</span>
                </GhostButton>
              </FlexRow>
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Press <Code>n</Code> for notification, <Code>Esc</Code> to close modal
              </div>
            </div>
          </Section>
        </HeroFade>
      </div>

      {/* ── Tab navigation ──────────────────────────────── */}
      <Section>
        <FlexRow style={{ marginBottom: "24px" }}>
          {(["dashboard", "components", "hooks"] as const).map((tab) => (
            <Btn
              type="button"
              style={() => ({
                background: activeTab() === tab ? "var(--primary)" : "var(--bg-surface)",
                color: activeTab() === tab ? "#fff" : "var(--text)",
              })}
              onClick={() => activeTab.set(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </Btn>
          ))}
        </FlexRow>

        {/* ── Dashboard tab (coolgrid + kinetic stagger) */}
        {() =>
          activeTab() === "dashboard" && (
            <DashboardTab
              stats={stats}
              filteredItems={filteredItems}
              searchInput={searchInput}
              debouncedSearch={debouncedSearch}
            />
          )
        }

        {/* ── Components tab (rocketstyle + attrs + elements) */}
        {() => activeTab() === "components" && <ComponentsTab />}

        {/* ── Hooks tab */}
        {() => activeTab() === "hooks" && <HooksTab />}
      </Section>

      {/* ── Modal (kinetic + useScrollLock + useKeyboard) */}
      {() =>
        modalOpen.value() && (
          <ModalOverlay
            onClose={() => {
              modalOpen.setFalse()
              scrollLock.unlock()
            }}
          />
        )
      }
    </Page>
  )
}

// ─── Dashboard Tab ───────────────────────────────────────────────────────────

function DashboardTab(props: {
  stats: Array<{ label: string; value: string; change: string; trend: string }>
  filteredItems: () => Array<{
    name: string
    pkg: string
    status: string
  }>
  searchInput: ReturnType<typeof signal<string>>
  debouncedSearch: () => string
}) {
  return (
    <div>
      {/* Stats grid with animated cards */}
      <Container>
        <Row>
          {props.stats.map((stat) => (
            <Col size={[12, 6, 3]}>
              <SlideUp appear show={() => true}>
                <StatCard stat={stat} />
              </SlideUp>
            </Col>
          ))}
        </Row>
      </Container>

      <Divider />

      {/* Search + filtered list */}
      <SectionTitle style={{ fontSize: "18px" }}>Component Registry</SectionTitle>
      <SectionDesc>
        Search with debounced input (<Code>useDebouncedValue</Code>)
      </SectionDesc>

      <input
        type="text"
        placeholder="Search components..."
        value={props.searchInput}
        onInput={(e: Event) => props.searchInput.set((e.target as HTMLInputElement).value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px 14px",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          color: "var(--text)",
          fontSize: "14px",
          marginBottom: "16px",
          outline: "none",
        }}
      />

      <div
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          marginBottom: "12px",
        }}
      >
        {() =>
          `Showing ${props.filteredItems().length} items (debounced: "${props.debouncedSearch()}")`
        }
      </div>

      {/* List component from @pyreon/elements */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {() =>
          props.filteredItems().map((item) => (
            <FadeIn appear show={() => true}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                }}
              >
                <FlexRow>
                  <span style={{ fontWeight: "600" }}>{item.name}</span>
                  <Code>@pyreon/{item.pkg}</Code>
                </FlexRow>
                <RsBadge success>
                  <span>{item.status}</span>
                </RsBadge>
              </div>
            </FadeIn>
          ))
        }
      </div>
    </div>
  )
}

// ─── Stat Card (useHover + Element) ──────────────────────────────────────────

function StatCard(props: {
  stat: { label: string; value: string; change: string; trend: string }
}) {
  const { hovered, props: hoverProps } = useHover()

  const trendColors: Record<string, string> = {
    up: "var(--success)",
    down: "var(--danger)",
    flat: "var(--text-muted)",
  }

  return (
    <Card
      {...hoverProps}
      style={() => ({
        transform: hovered() ? "translateY(-2px)" : "none",
        boxShadow: hovered() ? "var(--shadow-lg)" : "var(--shadow)",
        marginBottom: "16px",
      })}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {props.stat.label}
        </span>
        <span style={{ fontSize: "28px", fontWeight: "700" }}>{props.stat.value}</span>
        <span
          style={{
            fontSize: "13px",
            color: trendColors[props.stat.trend],
          }}
        >
          {props.stat.change}
        </span>
      </div>
    </Card>
  )
}

// ─── Components Tab ──────────────────────────────────────────────────────────

function ComponentsTab() {
  return (
    <div>
      <FadeIn appear show={() => true}>
        {/* Rocketstyle buttons */}
        <Card style={{ marginBottom: "24px" }}>
          <SectionTitle style={{ fontSize: "18px" }}>Rocketstyle Buttons</SectionTitle>
          <SectionDesc>
            Design-system primitives with <Code>.theme()</Code>, <Code>.states()</Code>,{" "}
            <Code>.sizes()</Code>
          </SectionDesc>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <FlexRow>
              <RsButton>
                <span>Default</span>
              </RsButton>
              <RsButton success>
                <span>Success</span>
              </RsButton>
              <RsButton danger>
                <span>Danger</span>
              </RsButton>
              <RsButton warning>
                <span>Warning</span>
              </RsButton>
            </FlexRow>

            <FlexRow>
              <RsButton sm>
                <span>Small</span>
              </RsButton>
              <RsButton md>
                <span>Medium</span>
              </RsButton>
              <RsButton lg>
                <span>Large</span>
              </RsButton>
            </FlexRow>

            <FlexRow>
              <RsButton success sm>
                <span>Success SM</span>
              </RsButton>
              <RsButton danger lg>
                <span>Danger LG</span>
              </RsButton>
              <RsButton warning md>
                <span>Warning MD</span>
              </RsButton>
            </FlexRow>
          </div>
        </Card>

        {/* Rocketstyle badges */}
        <Card style={{ marginBottom: "24px" }}>
          <SectionTitle style={{ fontSize: "18px" }}>Rocketstyle Badges</SectionTitle>
          <SectionDesc>Same dimension pattern for badges</SectionDesc>
          <FlexRow>
            <RsBadge>
              <span>Default</span>
            </RsBadge>
            <RsBadge success>
              <span>Success</span>
            </RsBadge>
            <RsBadge danger>
              <span>Danger</span>
            </RsBadge>
            <RsBadge warning>
              <span>Warning</span>
            </RsBadge>
          </FlexRow>
        </Card>

        {/* Attrs composition */}
        <Card style={{ marginBottom: "24px" }}>
          <SectionTitle style={{ fontSize: "18px" }}>Attrs Composition</SectionTitle>
          <SectionDesc>
            Chainable <Code>.attrs()</Code> for default props
          </SectionDesc>
          <FlexRow>
            {/* @ts-expect-error -- attrs built types lose component prop types */}
            <PrimaryButton onClick={() => addNotification("Primary clicked!", "info")}>
              <span>Primary (attrs)</span>
            </PrimaryButton>
            {/* @ts-expect-error -- attrs built types lose component prop types */}
            <DangerButton onClick={() => addNotification("Danger clicked!", "danger")}>
              <span>Danger (attrs)</span>
            </DangerButton>
            {/* @ts-expect-error -- attrs built types lose component prop types */}
            <GhostButton onClick={() => addNotification("Ghost clicked!", "success")}>
              <span>Ghost (attrs)</span>
            </GhostButton>
          </FlexRow>
        </Card>

        {/* Element layouts */}
        <Card style={{ marginBottom: "24px" }}>
          <SectionTitle style={{ fontSize: "18px" }}>Element Layouts</SectionTitle>
          <SectionDesc>
            Three-section flex: <Code>beforeContent</Code> | children | <Code>afterContent</Code>
          </SectionDesc>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <UserRow
              initial="A"
              color="var(--primary)"
              name="Alice Johnson"
              jobRole="Frontend Engineer"
              statusText="online"
              statusState="success"
            />
            <UserRow
              initial="B"
              color="var(--success)"
              name="Bob Smith"
              jobRole="UI Designer"
              statusText="away"
              statusState="warning"
            />
          </div>
        </Card>

        {/* Responsive grid */}
        <Card style={{ marginBottom: "24px" }}>
          <SectionTitle style={{ fontSize: "18px" }}>Responsive Grid</SectionTitle>
          <SectionDesc>
            <Code>Container</Code> / <Code>Row</Code> / <Code>Col</Code> with breakpoint-responsive
            sizes
          </SectionDesc>
          <Container>
            <Row>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Col size={[12, 6, 4]}>
                  <div
                    style={{
                      padding: "16px",
                      background: "var(--bg-surface)",
                      borderRadius: "6px",
                      textAlign: "center",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Col {n}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </Card>

        {/* Text & List */}
        <Card>
          <SectionTitle style={{ fontSize: "18px" }}>Text & List</SectionTitle>
          <SectionDesc>Data-driven rendering with positional metadata</SectionDesc>
          <List
            data={[
              "useHover — interaction tracking",
              "useToggle — boolean state management",
              "useColorScheme — OS theme detection",
              "useMediaQuery — responsive breakpoints",
              "useKeyboard — keyboard shortcuts",
            ]}
            component={ListItem}
          />
        </Card>
      </FadeIn>
    </div>
  )
}

// ─── Element User Row ────────────────────────────────────────────────────────

function UserRow(props: {
  initial: string
  color: string
  name: string
  jobRole: string
  statusText: string
  statusState: string
}) {
  return (
    // @ts-expect-error -- Element built types use Record<string, never>
    <Element
      tag="div"
      direction="inline"
      gap={12}
      alignY="center"
      beforeContent={
        <span
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: props.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          {props.initial}
        </span>
      }
      afterContent={
        <Badge
          style={{
            background: props.statusState === "success" ? "var(--success)" : "var(--warning)",
            color: "#fff",
          }}
        >
          {props.statusText}
        </Badge>
      }
    >
      <div>
        <span style={{ fontWeight: "600", display: "block" }}>{props.name}</span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{props.jobRole}</span>
      </div>
    </Element>
  )
}

// ─── List Item ───────────────────────────────────────────────────────────────

function ListItem(props: {
  children?: any
  index?: number
  first?: boolean
  last?: boolean
  odd?: boolean
  position?: number
}) {
  return (
    <div
      style={{
        padding: "10px 14px",
        background: props.odd ? "var(--bg-surface)" : "var(--bg-card)",
        borderRadius: props.first ? "6px 6px 0 0" : props.last ? "0 0 6px 6px" : "0",
        borderBottom: props.last ? "none" : "1px solid var(--border)",
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "var(--primary)",
          fontWeight: "600",
          minWidth: "20px",
        }}
      >
        {props.position}
      </span>
      <Text tag="span">{props.children}</Text>
    </div>
  )
}

// ─── Hooks Tab ───────────────────────────────────────────────────────────────

function HooksTab() {
  return (
    <FadeIn appear show={() => true}>
      <Container>
        <Row>
          <Col size={[12, 6]}>
            <HoverFocusDemo />
          </Col>
          <Col size={[12, 6]}>
            <ElementSizeDemo />
          </Col>
          <Col size={[12, 6]}>
            <ClickOutsideDemo />
          </Col>
          <Col size={[12, 6]}>
            <ToggleCounterDemo />
          </Col>
        </Row>
      </Container>
    </FadeIn>
  )
}

function HoverFocusDemo() {
  const { hovered, props: hoverProps } = useHover()
  const { focused, props: focusProps } = useFocus()

  return (
    <Card style={{ marginBottom: "16px" }}>
      <SectionTitle style={{ fontSize: "16px" }}>useHover + useFocus</SectionTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <div
          {...hoverProps}
          style={() => ({
            padding: "16px",
            borderRadius: "6px",
            background: hovered() ? "var(--primary)" : "var(--bg-surface)",
            color: hovered() ? "#fff" : "var(--text)",
            transition: "all 0.2s",
            textAlign: "center",
            fontWeight: "500",
          })}
        >
          {() => (hovered() ? "Hovered!" : "Hover me")}
        </div>
        <input
          type="text"
          placeholder="Focus me..."
          {...focusProps}
          style={() => ({
            padding: "10px 14px",
            borderRadius: "6px",
            border: `2px solid ${focused() ? "var(--primary)" : "var(--border)"}`,
            background: "var(--bg-surface)",
            color: "var(--text)",
            outline: "none",
            transition: "border-color 0.2s",
          })}
        />
        <FlexRow>
          <Badge
            style={() => ({
              background: hovered() ? "var(--primary)" : "var(--bg-surface)",
              color: hovered() ? "#fff" : "var(--text)",
            })}
          >
            {() => `hovered: ${hovered()}`}
          </Badge>
          <Badge
            style={() => ({
              background: focused() ? "var(--primary)" : "var(--bg-surface)",
              color: focused() ? "#fff" : "var(--text)",
            })}
          >
            {() => `focused: ${focused()}`}
          </Badge>
        </FlexRow>
      </div>
    </Card>
  )
}

function ElementSizeDemo() {
  let boxRef: HTMLElement | null = null
  const size = useElementSize(() => boxRef)

  return (
    <Card style={{ marginBottom: "16px" }}>
      <SectionTitle style={{ fontSize: "16px" }}>useElementSize</SectionTitle>
      <div
        // @ts-expect-error -- Pyreon supports callback refs at runtime
        ref={(el: HTMLElement) => {
          boxRef = el
        }}
        style={{
          marginTop: "12px",
          padding: "24px",
          background: "var(--bg-surface)",
          borderRadius: "6px",
          textAlign: "center",
          resize: "horizontal",
          overflow: "auto",
          minWidth: "150px",
        }}
      >
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          Resize me (drag right edge)
        </span>
        <div style={{ marginTop: "8px", fontSize: "24px", fontWeight: "700" }}>
          {() => `${size().width} x ${size().height}`}
        </div>
      </div>
    </Card>
  )
}

function ClickOutsideDemo() {
  const open = useToggle(false)
  let dropdownRef: HTMLElement | null = null

  useClickOutside(
    () => dropdownRef,
    () => open.setFalse(),
  )

  return (
    <Card style={{ marginBottom: "16px" }}>
      <SectionTitle style={{ fontSize: "16px" }}>useClickOutside</SectionTitle>
      <div style={{ marginTop: "12px", position: "relative" }}>
        {/* @ts-expect-error -- attrs built types lose component prop types */}
        <PrimaryButton onClick={() => open.toggle()}>
          <span>{() => (open.value() ? "Close dropdown" : "Open dropdown")}</span>
        </PrimaryButton>
        {() =>
          open.value() && (
            <SlideDown appear show={() => true}>
              <div
                // @ts-expect-error -- Pyreon supports callback refs at runtime
                ref={(el: HTMLElement) => {
                  dropdownRef = el
                }}
                style={{
                  position: "absolute",
                  top: "44px",
                  left: "0",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  boxShadow: "var(--shadow-lg)",
                  padding: "8px 0",
                  minWidth: "180px",
                  zIndex: "10",
                }}
              >
                {["Profile", "Settings", "Logout"].map((item) => (
                  <div
                    role="menuitem"
                    tabIndex={0}
                    style={{
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => {
                      addNotification(`${item} clicked`, "info")
                      open.setFalse()
                    }}
                    onKeyDown={(e: KeyboardEvent) => {
                      if (e.key === "Enter" || e.key === " ") {
                        addNotification(`${item} clicked`, "info")
                        open.setFalse()
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </SlideDown>
          )
        }
      </div>
    </Card>
  )
}

function ToggleCounterDemo() {
  const count = signal(0)
  const expanded = useToggle(false)

  return (
    <Card style={{ marginBottom: "16px" }}>
      <SectionTitle style={{ fontSize: "16px" }}>useToggle + signals</SectionTitle>
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <FlexRow>
          {/* @ts-expect-error -- attrs built types lose component prop types */}
          <GhostButton onClick={() => count.set(count() - 1)}>
            <span>-</span>
          </GhostButton>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              minWidth: "60px",
              textAlign: "center",
            }}
          >
            {count}
          </span>
          {/* @ts-expect-error -- attrs built types lose component prop types */}
          <GhostButton onClick={() => count.set(count() + 1)}>
            <span>+</span>
          </GhostButton>
        </FlexRow>

        <Btn
          type="button"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text)",
          }}
          onClick={() => expanded.toggle()}
        >
          {() => (expanded.value() ? "Collapse" : "Expand")}
        </Btn>

        {() =>
          expanded.value() && (
            <FadeIn appear show={() => true}>
              <div
                style={{
                  padding: "16px",
                  background: "var(--bg-surface)",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <p style={{ marginBottom: "8px" }}>
                  This content is toggled with <Code>useToggle</Code>.
                </p>
                <p>
                  Current count: <strong>{() => `${count()}`}</strong>
                </p>
              </div>
            </FadeIn>
          )
        }
      </div>
    </Card>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function ModalOverlay(props: { onClose: () => void }) {
  return (
    <FadeIn appear show={() => true}>
      <div
        role="dialog"
        tabIndex={-1}
        style={{
          position: "fixed",
          inset: "0",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "300",
        }}
        onClick={(e: Event) => {
          if (e.target === e.currentTarget) props.onClose()
        }}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Escape") props.onClose()
        }}
      >
        <SlideUp appear show={() => true}>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "480px",
              width: "90vw",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <SectionTitle style={{ fontSize: "20px", marginBottom: "12px" }}>
              Modal Dialog
            </SectionTitle>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              This modal uses:
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginBottom: "20px",
              }}
            >
              <p>
                <Code>kinetic</Code> — fade + slideUp animations
              </p>
              <p>
                <Code>useScrollLock</Code> — prevents body scroll
              </p>
              <p>
                <Code>useKeyboard</Code> — Escape to close
              </p>
            </div>
            <FlexRow style={{ justifyContent: "flex-end" }}>
              {/* @ts-expect-error -- attrs built types lose component prop types */}
              <GhostButton onClick={props.onClose}>
                <span>Cancel</span>
              </GhostButton>
              {/* @ts-expect-error -- attrs built types lose component prop types */}
              <PrimaryButton
                onClick={() => {
                  addNotification("Modal confirmed!", "success")
                  props.onClose()
                }}
              >
                <span>Confirm</span>
              </PrimaryButton>
            </FlexRow>
          </div>
        </SlideUp>
      </div>
    </FadeIn>
  )
}
