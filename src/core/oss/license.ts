export enum License {
  CcBySa3 = 'cc-by-sa-3',
  Mit = 'mit',
  NewBsd = 'new-bsd',
}

export function fullLicense(
  license: License,
  years: number[],
  holder: string,
  modifications: string[],
): string {
  return [
    licenseTitle(license),
    '',
    licenseCopyright(license, years, holder),
    '',
    ...modifications,
    '',
    licenseText(license),
  ].join('\n')
}

export function licenseTitle(license: License): string {
  switch (license) {
    case License.CcBySa3:
      return 'Creative Commons Attribution-ShareAlike 3.0 Unported'
    case License.Mit:
      return 'MIT'
    case License.NewBsd:
      return 'BSD 3-Clause'
  }
}

export function licenseShortTitle(license: License): string {
  switch (license) {
    case License.CcBySa3:
      return 'CC By 3'
    case License.Mit:
      return 'MIT'
    case License.NewBsd:
      return 'BSD'
  }
}

export function licenseUrl(license: License): string {
  switch (license) {
    case License.CcBySa3:
      return 'https://creativecommons.org/licenses/by-sa/3.0/legalcode'
    case License.Mit:
      return 'https://opensource.org/licenses/MIT'
    case License.NewBsd:
      return 'https://opensource.org/licenses/BSD-3-Clause'
  }
}

export function licenseCopyright(license: License, years: number[], holder: string): string {
  switch (license) {
    case License.CcBySa3:
    case License.Mit:
      return `Copyright (c) ${years.join(', ')} ${holder}}`
    case License.NewBsd:
      return `Copyright (c) ${years.join(', ')} ${holder}} All rights reserved`
  }
}

export function licenseText(license: License): string {
  switch (license) {
    case License.CcBySa3:
      return ccBySa3Text
    case License.Mit:
      return mitText
    case License.NewBsd:
      return newBsdText
  }
}

const ccBySa3Text =
  'This work is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.'

const mitText = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`

const newBsdText = `Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`
