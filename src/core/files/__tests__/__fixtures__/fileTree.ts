import { directory, file } from '../../fileSystem'

export const profileImage = file('profile.jpg', 'profile')

export default directory('documents', [
  directory('media', [
    directory('images', [profileImage]),
    directory('music', [
      directory('artists', [
        directory('chico-buarque', [
          file('apesar-de-voce.mp3', 'Apesar de Você'),
          file('pedro-pedreiro.mp3', 'pedro-pedreiro'),
        ]),
        directory('silvio-rodriguez', [file('ojala.mp3', 'ojala')]),
      ]),
    ]),
    directory('videos', []),
  ]),
  file('essay.docx', 'essay'),
])
