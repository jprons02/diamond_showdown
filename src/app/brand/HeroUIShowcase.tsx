"use client";

import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner,
  Checkbox,
  Switch,
  Chip,
} from "@heroui/react";
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

const positions = [
  { key: "pitcher", label: "Pitcher" },
  { key: "catcher", label: "Catcher" },
  { key: "first-base", label: "First Base" },
  { key: "shortstop", label: "Shortstop" },
  { key: "outfield", label: "Outfield" },
];

const sampleColors = [
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Gold", value: "#F59E0B" },
  { label: "Green", value: "#22C55E" },
  { label: "Teal", value: "#0ED3CF" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Indigo", value: "#6366F1" },
  { label: "Purple", value: "#A855F7" },
  { label: "Pink", value: "#EC4899" },
  { label: "Slate", value: "#64748B" },
];

export function ButtonShowcase() {
  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-white mb-4">Buttons</p>
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="primary" variant="solid">
          Primary Solid
        </Button>
        <Button color="primary" variant="bordered">
          Primary Bordered
        </Button>
        <Button color="primary" variant="flat">
          Primary Flat
        </Button>
        <Button color="primary" variant="ghost">
          Ghost
        </Button>
        <Button color="primary" variant="light">
          Light
        </Button>
        <Button color="primary" variant="shadow">
          Shadow
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="primary" size="sm">
          Small
        </Button>
        <Button color="primary" size="md">
          Medium
        </Button>
        <Button color="primary" size="lg">
          Large
        </Button>
        <Button color="primary" isLoading>
          Loading
        </Button>
        <Button color="primary" isDisabled>
          Disabled
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="default" variant="solid">
          Default
        </Button>
        <Button color="secondary" variant="solid">
          Secondary
        </Button>
        <Button color="success" variant="solid">
          Success
        </Button>
        <Button color="warning" variant="solid">
          Warning
        </Button>
        <Button color="danger" variant="solid">
          Danger
        </Button>
      </div>
    </div>
  );
}

export function InputShowcase() {
  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-white mb-4">Form Inputs</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Team Name"
          placeholder="Enter team name"
          variant="bordered"
        />
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          variant="bordered"
          description="We'll never share your email."
        />
        <Input
          label="Disabled"
          placeholder="Can't edit this"
          variant="bordered"
          isDisabled
        />
        <Input
          label="Read Only"
          value="Diamond Showdown"
          variant="bordered"
          isReadOnly
        />
        <Select
          label="Position"
          placeholder="Select a position"
          variant="bordered"
        >
          {positions.map((pos) => (
            <SelectItem key={pos.key}>{pos.label}</SelectItem>
          ))}
        </Select>
        <Input
          label="With Error"
          placeholder="Invalid value"
          variant="bordered"
          isInvalid
          errorMessage="This field is required."
        />
        <Textarea
          label="Notes"
          placeholder="Any additional notes or requests..."
          variant="bordered"
          className="sm:col-span-2"
        />
      </div>
      <div className="flex flex-wrap gap-6 items-center pt-2">
        <Checkbox color="primary" defaultSelected>
          Agree to rules
        </Checkbox>
        <Checkbox color="primary">Opt-in to notifications</Checkbox>
        <Switch color="primary" defaultSelected>
          Active roster
        </Switch>
      </div>
    </div>
  );
}

export function SampleFormShowcase() {
  return (
    <div className="space-y-4">
      {/* Row 1 — Name + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tournament Name"
          variant="bordered"
          isRequired
          defaultValue="Spring Classic 2026"
          placeholder="Spring Classic 2026"
        />
        <Input
          label="Slug"
          variant="bordered"
          defaultValue="spring-classic-2026"
          placeholder="spring-classic-2026"
        />
      </div>

      {/* Row 2 — Event Date + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          label="Event Date"
          granularity="day"
          variant="bordered"
          defaultValue={parseDate("2026-06-14")}
        />
        <Select
          label="Status"
          variant="bordered"
          defaultSelectedKeys={["open"]}
        >
          <SelectItem key="draft">Draft</SelectItem>
          <SelectItem key="open">Open</SelectItem>
          <SelectItem key="closed">Closed</SelectItem>
          <SelectItem key="completed">Completed</SelectItem>
          <SelectItem key="cancelled">Cancelled</SelectItem>
        </Select>
      </div>

      {/* Row 3 — Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Location Name"
          variant="bordered"
          defaultValue="City Park Fields"
          placeholder="City Park Fields"
        />
        <Input
          label="Location Address"
          variant="bordered"
          defaultValue="123 Main St, City, ST"
          placeholder="123 Main St, City, ST"
        />
      </div>

      {/* Row 4 — Registration window */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          label="Registration Opens"
          granularity="day"
          variant="bordered"
          defaultValue={parseDate("2026-03-01")}
        />
        <DatePicker
          label="Registration Closes"
          granularity="day"
          variant="bordered"
          defaultValue={parseDate("2026-05-31")}
        />
      </div>

      {/* Row 5 — Draft Date + Bracket Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          label="Draft Date"
          granularity="day"
          variant="bordered"
          defaultValue={parseDate("2026-06-07")}
        />
        <Select
          label="Bracket Format"
          variant="bordered"
          defaultSelectedKeys={["pool_to_bracket"]}
        >
          <SelectItem key="single_elimination">Single Elimination</SelectItem>
          <SelectItem key="double_elimination">Double Elimination</SelectItem>
          <SelectItem key="pool_to_bracket">Pool Play → Bracket</SelectItem>
          <SelectItem key="custom">Custom</SelectItem>
        </Select>
      </div>

      {/* Row 6 — Player limits + fee */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Min Players"
          variant="bordered"
          type="number"
          defaultValue="70"
          placeholder="70"
        />
        <Input
          label="Max Players"
          variant="bordered"
          type="number"
          defaultValue="100"
          placeholder="100"
        />
        <Input
          label="Entry Fee ($)"
          variant="bordered"
          type="number"
          defaultValue="50.00"
          placeholder="50.00"
        />
      </div>

      {/* Row 7 — Rules / Notes */}
      <Textarea
        label="Rules / Notes"
        variant="bordered"
        minRows={3}
        defaultValue="All participants must check in 30 minutes before game time. No metal spikes."
        placeholder="Optional rules or notes..."
      />

      {/* Row 8 — Toggles & Checkboxes */}
      <div className="pt-1 border-t border-white/5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Settings
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <Switch color="primary" defaultSelected size="sm">
            <span className="text-sm text-gray-300">Registration open</span>
          </Switch>
          <Switch color="primary" defaultSelected size="sm">
            <span className="text-sm text-gray-300">
              Publish bracket publicly
            </span>
          </Switch>
          <Switch color="primary" size="sm">
            <span className="text-sm text-gray-300">
              Allow late registrations
            </span>
          </Switch>
          <Switch color="primary" defaultSelected size="sm">
            <span className="text-sm text-gray-300">Email confirmations</span>
          </Switch>
          <Checkbox color="primary" defaultSelected size="sm">
            <span className="text-sm text-gray-300">
              Require waiver signature
            </span>
          </Checkbox>
          <Checkbox color="primary" size="sm">
            <span className="text-sm text-gray-300">Waitlist if full</span>
          </Checkbox>
        </div>
      </div>

      {/* Row 9 — Select with scrollbar & color swatches */}
      <div className="pt-1 border-t border-white/5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Scrollable Select (reference design)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Team Color"
            variant="bordered"
            placeholder="Pick a color"
            scrollShadowProps={{ hideScrollBar: false }}
            classNames={{ listboxWrapper: "max-h-44" }}
            renderValue={(items) =>
              items.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                    style={{
                      backgroundColor: sampleColors.find(
                        (c) => c.value === item.key,
                      )?.value,
                    }}
                  />
                  <span>{item.textValue}</span>
                </div>
              ))
            }
          >
            {sampleColors.map((c) => (
              <SelectItem
                key={c.value}
                textValue={c.label}
                startContent={
                  <div
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: c.value }}
                  />
                }
              >
                {c.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="bordered">Cancel</Button>
        <Button color="primary">Create Tournament</Button>
      </div>
    </div>
  );
}

export function CardShowcase() {
  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-white mb-4">Cards</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-0">
            <p className="text-sm font-semibold">Default Card</p>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-default-500">
              HeroUI Card with default styling. Automatically adapts to the dark
              theme.
            </p>
          </CardBody>
        </Card>

        <Card isBlurred className="border border-primary/30">
          <CardHeader className="pb-0">
            <p className="text-sm font-semibold">Blurred + Accent</p>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-default-500">
              isBlurred prop with a primary accent border for emphasis.
            </p>
          </CardBody>
        </Card>

        <Card shadow="lg">
          <CardHeader className="pb-0">
            <p className="text-sm font-semibold">Large Shadow</p>
          </CardHeader>
          <CardBody>
            <p className="text-xs text-default-500">
              shadow=&quot;lg&quot; for elevated card appearance.
            </p>
          </CardBody>
          <CardFooter className="pt-0">
            <Button size="sm" color="primary" variant="flat">
              Action
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export function SpinnerShowcase() {
  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-white mb-4">
        Spinners &amp; Chips
      </p>
      <div className="flex flex-wrap gap-8 items-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" color="primary" />
          <span className="text-xs text-gray-500">Small</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" color="primary" />
          <span className="text-xs text-gray-500">Medium</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" color="primary" />
          <span className="text-xs text-gray-500">Large</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" color="default" />
          <span className="text-xs text-gray-500">Default</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" color="success" />
          <span className="text-xs text-gray-500">Success</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-4">
        <Chip color="primary" variant="solid">
          Primary
        </Chip>
        <Chip color="primary" variant="bordered">
          Bordered
        </Chip>
        <Chip color="primary" variant="flat">
          Flat
        </Chip>
        <Chip color="success" variant="flat">
          Active
        </Chip>
        <Chip color="warning" variant="flat">
          Pending
        </Chip>
        <Chip color="danger" variant="flat">
          Eliminated
        </Chip>
        <Chip color="default" variant="flat">
          Default
        </Chip>
      </div>
    </div>
  );
}
