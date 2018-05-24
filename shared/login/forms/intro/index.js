// @flow
import * as React from 'react'
import {Text, Icon, Box2, ButtonBar, Button} from '../../../common-adapters'
import {globalColors, styleSheetCreate, globalMargins} from '../../../styles'

type Props = {|
  bannerMessage: ?string,
  onFeedback: ?() => void,
  onLogin: () => void,
  onSignup: () => void,
|}

const Feedback = ({onFeedback}) =>
  onFeedback ? (
    <Text type="BodySmallSecondaryLink" onClick={onFeedback}>
      Problems logging in?
    </Text>
  ) : (
    <Text type="BodySmall">
      Send us feedback: Run <Text type="TerminalInline">keybase log send</Text> from the terminal
    </Text>
  )

const Intro = (props: Props) => (
  <Box2 direction="vertical" fullWidth={true} fullHeight={true} gap="small">
    {!!props.bannerMessage && (
      <Box2 direction="vertical" fullWidth={true} style={styles.banner}>
        <Text type="BodySemibold" style={styles.bannerMessage}>
          {props.bannerMessage}
        </Text>
      </Box2>
    )}
    <Box2 direction="vertical" fullWidth={true} fullHeight={true} gap="small" style={styles.innerContainer}>
      <Icon type="icon-keybase-logo-80" />
      <Text type="HeaderBig" style={styles.join}>
        Join Keybase
      </Text>
      <ButtonBar>
        <Button type="Primary" onClick={props.onSignup} label="Create an account" />
      </ButtonBar>
      <Box2 direction="vertical" style={styles.gap} />
      <Text type="Body" onClick={props.onLogin}>
        Already on Keybase?
      </Text>
      <Button type="Secondary" onClick={props.onLogin} label="Log in" />
      <Feedback onFeedback={props.onFeedback} />
    </Box2>
  </Box2>
)

const styles = styleSheetCreate({
  banner: {backgroundColor: globalColors.blue, padding: globalMargins.medium},
  bannerMessage: {color: globalColors.white, textAlign: 'center'},
  gap: {flexGrow: 1},
  innerContainer: {alignItems: 'center', flexGrow: 1, justifyContent: 'center', padding: globalMargins.large},
  join: {color: globalColors.orange},
})

export default Intro
