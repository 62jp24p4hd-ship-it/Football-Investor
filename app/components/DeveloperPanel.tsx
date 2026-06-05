"use client";

export type DevEventId =
  | "hotMarket"
  | "saudiOffer"
  | "ballonDor"
  | "goldenBoy"
  | "goldenBoot"
  | "recordTransfer"
  | "wonderkid"
  | "aclInjury"
  | "majorInjury"
  | "benchWarmer"
  | "failedTransfer"
  | "freeTransfer"
  | "marketCrash"
  | "retirement"
  | "investorOffer"
  | "legendaryAuction";

type DevEventButton = {
  id: DevEventId;
  label: string;
};

type DeveloperPanelProps = {
  open: boolean;
  events: DevEventButton[];
  onTriggerEvent: (eventId: DevEventId) => void;
  onClose: () => void;
};

export default function DeveloperPanel(
  props: DeveloperPanelProps
) {
  const {
    open,
    events,
    onTriggerEvent,
    onClose,
  } = props;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed top-24 right-4 w-80 bg-zinc-950 border border-purple-500 rounded-2xl p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-purple-300">
          Developer Events
        </h2>

        <button
          onClick={onClose}
          className="px-3 py-1 rounded bg-red-700 transition-all active:scale-95"
        >
          X
        </button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => onTriggerEvent(event.id)}
            className="w-full text-left px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition-all active:scale-95"
          >
            {event.label}
          </button>
        ))}
      </div>
    </div>
  );
}