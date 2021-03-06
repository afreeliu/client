// @flow
import * as I from 'immutable'
import {
  compose,
  connect,
  lifecycle,
  type Dispatch,
  type TypedState,
  setDisplayName,
} from '../../util/container'
import * as Constants from '../../constants/fs'
import * as FsGen from '../../actions/fs-gen'
import * as React from 'react'
import * as Types from '../../constants/types/fs'
import DefaultView from './default-view-container'
import ImageView from './image-view'
import TextView from './text-view'
import AVView from './av-view'
import PdfView from './pdf-view'
import {Box, Text} from '../../common-adapters'
import {globalStyles, globalColors, platformStyles} from '../../styles'
import {isAndroid} from '../../constants/platform'

type Props = {
  path: Types.Path,
  routePath: I.List<string>,
}

const mapStateToProps = (state: TypedState, {path}: Props) => {
  const _pathItem = state.fs.pathItems.get(path) || Constants.makeFile()
  return {
    _serverInfo: state.fs.localHTTPServerInfo,
    mimeType: _pathItem.type === 'file' ? _pathItem.mimeType : '',
    isSymlink: _pathItem.type === 'symlink',
  }
}

const mapDispatchToProps = (dispatch: Dispatch, {path}: Props) => ({
  loadMimeType: () => dispatch(FsGen.createMimeTypeLoad({path})),
})

const mergeProps = ({_serverInfo, mimeType, isSymlink}, {loadMimeType}, {path}) => ({
  url: Constants.generateFileURL(path, _serverInfo),
  mimeType,
  isSymlink,
  path,
  loadMimeType,
})

const Renderer = ({mimeType, isSymlink, url, path, routePath, loadMimeType}) => {
  if (isSymlink) {
    return <DefaultView path={path} routePath={routePath} />
  }

  if (mimeType === '') {
    return (
      <Box style={stylesLoadingContainer}>
        <Text type="BodySmall" style={stylesLoadingText}>
          Loading ...
        </Text>
      </Box>
    )
  }

  switch (Constants.viewTypeFromMimeType(mimeType)) {
    case 'default':
      return <DefaultView path={path} routePath={routePath} />
    case 'text':
      return <TextView url={url} routePath={routePath} />
    case 'image':
      return <ImageView url={url} routePath={routePath} />
    case 'av':
      return <AVView url={url} routePath={routePath} />
    case 'pdf':
      return isAndroid ? ( // Android WebView doesn't support PDF. Come on Android!
        <DefaultView path={path} routePath={routePath} />
      ) : (
        <PdfView url={url} routePath={routePath} />
      )
    default:
      return <Text type="BodyError">This shouldn't happen</Text>
  }
}

const stylesLoadingContainer = {
  ...globalStyles.flexBoxColumn,
  ...globalStyles.flexGrow,
  alignItems: 'center',
  justifyContent: 'center',
}
const stylesLoadingText = platformStyles({
  isMobile: {
    color: globalColors.white_40,
  },
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  setDisplayName('ViewContainer'),
  lifecycle({
    componentDidMount() {
      if (!this.props.isSymlink && this.props.mimeType === '') {
        this.props.loadMimeType()
      }
    },
    componentDidUpdate(prevProps) {
      if (
        !this.props.isSymlink &&
        // Trigger loadMimeType if we don't have it yet,
        this.props.mimeType === '' &&
        // but only if we haven't triggered it before.
        prevProps.mimeType !== ''
      ) {
        this.props.loadMimeType()
      }
    },
  })
)(Renderer)
