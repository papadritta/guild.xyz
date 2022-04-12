import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { Guild } from "types"

const useGuildByPlatformId = (platformId: string) => {
  const shouldFetch = platformId?.length > 0
  const { data } = useSWRImmutable<Guild>(
    shouldFetch ? `/guild/platformId/${platformId}` : null
  )

  const guild = useGuild(data?.id)

  const hasFreeEntry = useMemo(
    () =>
      guild.roles?.some((role) =>
        role.requirements.some((req) => req.type === "FREE")
      ),
    [guild.roles]
  )

  return {
    ...(data && guild),
    hasFreeEntry,
  }
}

export default useGuildByPlatformId
