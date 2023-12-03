import { useMemo } from "react";
import {
  useColorModeValue,
  useDisclosure,
  As,
  Flex,
  FlexProps,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";

import ZapModal from "@ngine/components/ZapModal";
import { Zap, Heart, Reply, Repost } from "@ngine/icons";
import useEvents from "@ngine/nostr/useEvents";
import { zapsSummary } from "@ngine/nostr/nip57";
import useSession from "@ngine/hooks/useSession";

const defaultKinds = [
  NDKKind.Zap,
  NDKKind.Repost,
  NDKKind.Reaction,
  NDKKind.Text,
];

interface ReactionCountProps extends FlexProps {
  icon: As;
  count: string | number;
  hasReacted: boolean;
}

function ReactionCount({
  icon,
  count,
  hasReacted,
  ...rest
}: ReactionCountProps) {
  const highlighted = useColorModeValue("brand.500", "brand.100");
  return (
    <Flex align="center" gap={2} direction="row" {...rest}>
      <Icon as={icon} color={hasReacted ? highlighted : "currentColor"} />
      <Text>{count}</Text>
    </Flex>
  );
}

interface ReactionsProps {
  event: NDKEvent;
  kinds?: NDKKind[];
}

function useReactions(event: NDKEvent, kinds: NDKKind[]) {
  const [t, id] = useMemo(() => event.tagReference(), [event]);
  const filter = useMemo(() => {
    return {
      kinds,
      [`#${t}`]: [id],
    } as NDKFilter;
  }, [t, id, kinds]);
  const { events } = useEvents(filter, {
    closeOnEose: false,
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });
  const zaps = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Zap),
    [events],
  );
  const reactions = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Reaction),
    [events],
  );
  const replies = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Text),
    [events],
  );
  const reposts = useMemo(
    () => events.filter((e) => e.kind === NDKKind.Repost),
    [events],
  );
  return { zaps, reactions, replies, reposts };
}

export default function Reactions({
  event,
  kinds = defaultKinds,
}: ReactionsProps) {
  const zapModal = useDisclosure();
  const [session] = useSession();
  const pubkey = session?.pubkey;
  const { zaps, reactions, replies, reposts } = useReactions(event, kinds);
  const { zapRequests, total } = useMemo(() => {
    return zapsSummary(zaps);
  }, [zaps]);

  return (
    <HStack color="gray.500" fontSize="sm" justify="space-between" spacing={6}>
      {kinds.map((k) => {
        if (k === NDKKind.Text) {
          return (
            <ReactionCount
              icon={Reply}
              count={replies.length}
              hasReacted={Boolean(replies.find((ev) => ev.pubkey === pubkey))}
            />
          );
        } else if (k === NDKKind.Zap) {
          return (
            <>
              <ReactionCount
                icon={Zap}
                count={total}
                hasReacted={Boolean(
                  zapRequests.find((r) => r.pubkey === pubkey),
                )}
                onClick={zapModal.onOpen}
                cursor="pointer"
              />
              <ZapModal pubkey={event.pubkey} event={event} {...zapModal} />
            </>
          );
        } else if (k === NDKKind.Reaction) {
          return (
            <ReactionCount
              icon={Heart}
              count={reactions.length}
              hasReacted={Boolean(reactions.find((r) => r.pubkey === pubkey))}
            />
          );
        } else if (k === NDKKind.Repost) {
          return (
            <ReactionCount
              icon={Repost}
              count={reposts.length}
              hasReacted={Boolean(reposts.find((r) => r.pubkey === pubkey))}
            />
          );
        }
      })}
    </HStack>
  );
}