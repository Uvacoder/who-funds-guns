import { Container, Box } from '@theme-ui/components'
import Header from '../components/header'
import Search from '../components/search'

const Page = ({ address }) => (
  <Box as="main" sx={{ bg: 'background', minHeight: '80vh' }}>
    <Header
      title="Find Your Representative"
      desc="Enter your U.S. home address to locate your Congressional Representative."
      includeMeta
    />
    <Container as="article" sx={{ py: [3, 4] }}>
      <Search defaultAddress={address} />
    </Container>
  </Box>
)

Page.getInitialProps = req => {
  const address = req.query.address || ''
  return { address }
}

export default Page
