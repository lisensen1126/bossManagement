import TestLayout from '@/components/test/TestLayout'
import RichTextFormat from '@/components/test/RichTextFormat'
import UEditor from '@/components/test/UEditor'

export default {
  name: 'test',
  path: 'test',
  component: TestLayout,
  children: [
    {
      name: 'richTextFormat',
      path: 'richTextFormat',
      component: RichTextFormat,
      meta: {
        module: 'test',
      },
    },
    {
      name: 'uEditor',
      path: 'uEditor',
      component: UEditor,
      meta: {
        module: 'test',
      },
    }
  ],
}