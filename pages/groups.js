import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Input,
  Label
} from '@theme-ui/components'
import Meta from '../components/meta'
import Header from '../components/header'
import { Group, CycleHeader, CycleStats } from '../components/cycle'
import fetch from '../lib/fetch'
import useFocusable from '../lib/use-focusable'
import { map, filter, sum, flatten } from 'lodash'

const Page = ({ cycles }) => {
  const [jump, setJump] = useState('')
  const [list, setList] = useState(cycles)
  const [stats, setStats] = useState({
    total: null,
    rightsTotal: null,
    controlTotal: null
  })

  const onChange = e =>
    setJump(e.target.value.toString().match(/[A-Za-z\s]+/g) || '')
  const onGroupClick = e => setJump(e.currentTarget.getAttribute('data-filter'))

  const calculateStats = src => {
    const getTotal = g => sum(map(g, 'amount'))
    const groups =
      src.length > 0
        ? src
        : [
            { amount: 0, type: 'rights' },
            { amount: 0, type: 'control' }
          ]
    const total = getTotal(groups)
    const rightsTotal = getTotal(filter(groups, ['type', 'rights']))
    const controlTotal = getTotal(filter(groups, ['type', 'control']))
    return { total, rightsTotal, controlTotal }
  }
  useEffect(() => {
    const groups = flatten(map(list, 'groups'))
    setStats(calculateStats(groups))
  }, [list])

  useEffect(() => {
    if (jump.toString().length > 0) {
      const j = jump.toString().toLowerCase()
      let nextCycles = JSON.parse(JSON.stringify(cycles))
      nextCycles = map(nextCycles, c => {
        c.groups = filter(c.groups, g => g.pac.toLowerCase().includes(j))
        c.stats = calculateStats(c.groups)
        return c
      })
      nextCycles = filter(nextCycles, c => c.groups.length > 0)
      setList(nextCycles)
    } else {
      setList(cycles)
    }
  }, [jump])

  const input = useRef(null)
  useFocusable(input)

  return (
    <Box as="main" sx={{ bg: 'background' }}>
      <Meta
        title="Gun Money PACs"
        description="Explore the top gun lobby and gun control PACs giving money to U.S. Congress every year."
      />
      <Header
        title="Contributors"
        desc="These are the top PAC groups giving money to Congress on gun issues."
      />
      <Container as="article" sx={{ py: [3, 4] }}>
        <Grid
          as="header"
          gap={[2, null, 3, 4]}
          sx={{
            alignItems: 'end',
            gridTemplateColumns: [null, null, '1fr auto']
          }}
        >
          <div>
            <Label htmlFor="filter">Filter list</Label>
            <Input
              type="search"
              name="filter"
              placeholder="NRA"
              onChange={onChange}
              value={jump}
              ref={input}
            />
          </div>
          <CycleStats {...stats} />
        </Grid>
        <Divider sx={{ mt: [4, 5], mb: [3, 4] }} />
        {list.map(cycle => (
          <Box
            as="section"
            key={cycle.year}
            sx={{
              mt: [3, 4],
              borderBottom: '1px solid',
              borderColor: 'border'
            }}
          >
            <CycleHeader cycle={cycle} />
            {cycle.groups.map(group => (
              <Group
                key={group.id}
                data-filter={group.pac}
                onClick={onGroupClick}
                {...group}
              />
            ))}
          </Box>
        ))}
        {list.length === 0 && (
          <Card variant="error" sx={{ mt: [3, 4] }}>
            No results found
          </Card>
        )}
      </Container>
    </Box>
  )
}

Page.getInitialProps = async ({ req }) => {
  const cycles = await fetch(req, '/groups')
  if (cycles.length < 2) return { statusCode: 422 }
  return { cycles }
}

export default Page
