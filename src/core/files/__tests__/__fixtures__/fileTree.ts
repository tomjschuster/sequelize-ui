import { directory, file } from '../..'

export default directory('documents', [
  directory('media', [
    directory('images', [file('profile.jpg', 'profile')]),
    directory('videos', []),
    directory('music', [
      directory('artists', [
        directory('chico-buarque', [file('pedro-pedreiro.mp3', 'pedro-pedreiro')]),
        directory('silvio-rodriguez', [file('ojala.mp3', 'ojala')]),
      ]),
    ]),
  ]),
  file('essay.docx', 'essay'),
])
