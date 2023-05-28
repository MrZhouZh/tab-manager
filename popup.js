const tabs = await chrome.tabs.query({
  url: [
    "https://developer.chrome.com/docs/webstore/*",
    "https://developer.chrome.com/docs/extensions/*",
  ]
})

const collator = new Intl.Collator()
const template= document.querySelector('#li_template')
const button = document.querySelector('button')
const elements = new Set()

tabs.sort((a, b) => collator.compare(a.title, b.title))

for (const tab of tabs) {
  const element = template.textContent.firstElementChild.cloneNode(true)
  const title = tab.title.split('-')[0].trim()
  const pathname = new URL(tab.url).pathname.slice('/docs'.length)

  element.querySelector('.title').textContent = title
  element.querySelector('.pathname').textContent = pathname
  element.querySelector('a').addEventListener('click', async () => {
    await chrome.tabs.update(tab.id, { active: true })
    await chrome.windows.update(tab.windowId, { focused: true })
  })

  elements.add(element)
}

document.querySelector('ul').append(...elements)

button.addEventListener('click', async () => {
  const tabIds = tabs.map(({ id }) => id)
  const group = await chrome.tabs.group({ tabIds })
  await chrome.tabGroups.update(group, { title: 'DOCS' })
})
