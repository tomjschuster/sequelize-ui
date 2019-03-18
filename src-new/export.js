import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export const downloadZip = ({ name = 'untitled', files }) => {
  const zip = new JSZip()
  files.forEach(file => zipFile(zip, file))

  return zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, name))
}

const zipFile = (zip, file) => {
  if (file.files) zipDir(zip, file)
  else zip.file(file.name, file.content)
}

const zipDir = (zip, dir) => {
  const folder = zip.folder(dir.name)
  for (let file of dir.files) zipFile(folder, file)
}
