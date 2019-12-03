import fetch from 'isomorphic-unfetch'
import Grouping from '../components/grouping'
import Search from '../components/search'
import Link from 'next/link'
import Map from 'react-usa-map'
import { Box, Card, Link as A, Flex, Grid, Heading } from '@theme-ui/components'
import { Briefcase, Users, Search as SearchIcon } from 'react-feather'

const Page = ({ profiles }) => (
  <Grouping
    title="Gun Funded"
    desc={
      <>
        In progress, fall 2019, by{' '}
        <A href="https://lachlanjc.me" sx={{color:'inherit'}}>
          @lachlanjc
        </A>
      </>
    }
    profiles={profiles}
    centeredHeader
  >
    <Heading as="h2" variant="headline">
      Find your Representative
    </Heading>
    <Search />
    <Heading as="h2" variant="headline" sx={{ mt: 4 }}>
      Explore
    </Heading>
    <Grid gap={3} columns={[1, 2, 4]}>
      <Link href="/states">
        <Card
          variant="nav"
          sx={{
            gridColumn: [null, null, 'span 2'],
            fontSize: [2, 3, 4],
            py: 3,
            svg: {
              fill: 'sunken',
              mb: [2, 3]
            }
          }}
        >
          <Map width={256} height={128} />
          Explore States
        </Card>
      </Link>
      <Link href="/groups">
        <Card
          variant="nav"
          sx={{
            gridColumn: [null, null, 'span 2'],
            fontSize: [2, 3, 4],
            svg: {
              stroke: 'orange',
              width: [48, 64],
              height: [48, 64]
            }
          }}
        >
          <Briefcase />
          Explore PACs
        </Card>
      </Link>
      <Link href="/top-senators">
        <Card variant="nav">
          Top US
          <br />
          Senators
        </Card>
      </Link>
      <Link href="/top-representatives">
        <Card variant="nav">
          Top US
          <br />
          Reps
        </Card>
      </Link>
      <Link href="/profiles">
        <Card variant="nav" sx={{ svg: { stroke: 'green' } }}>
          <Users size={32} />
          All Members
          <br />
          of Congress
        </Card>
      </Link>
      <Link href="/search">
        <Card variant="nav" sx={{ svg: { stroke: 'accent' } }}>
          <SearchIcon size={32} />
          Find
          <br />
          Your&nbsp;Rep
        </Card>
      </Link>
    </Grid>
    <Heading as="h2" variant="headline"  sx={{ mt: 4, mb: [3, 4] }}>
      Top 6 gun-funded Congresspeople
    </Heading>
  </Grouping>
)

Page.getInitialProps = async ({ req }) => {
  const origin = req ? `http://${req.headers.host}` : ''
  const data = await fetch(`${origin}/api/profiles?limit=6`)
  const profiles = await data.json()
  return { profiles }
}

export default Page
