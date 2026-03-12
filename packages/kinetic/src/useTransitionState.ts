import { createRef } from '@pyreon/core'
import { runUntracked, signal, watch } from '@pyreon/reactivity'
import type { TransitionStage, TransitionStateResult } from './types'

export type UseTransitionState = (options: {
  show: () => boolean
  appear?: boolean | undefined
}) => TransitionStateResult

const useTransitionState: UseTransitionState = ({ show, appear = false }) => {
  const initialShow = show()
  const stage = signal<TransitionStage>(
    initialShow && !appear ? 'entered' : 'hidden',
  )
  const elementRef = createRef<HTMLElement>()
  let isInitialMount = true

  watch(
    show,
    (showVal) => {
      if (isInitialMount) {
        isInitialMount = false
        if (showVal && appear) {
          stage.set('entering')
        }
        return
      }

      const currentStage = runUntracked(() => stage())
      if (showVal && (currentStage === 'hidden' || currentStage === 'leaving')) {
        stage.set('entering')
      } else if (
        !showVal &&
        (currentStage === 'entered' || currentStage === 'entering')
      ) {
        stage.set('leaving')
      }
    },
    { immediate: true },
  )

  const complete = () => {
    const current = stage()
    if (current === 'entering') stage.set('entered')
    if (current === 'leaving') stage.set('hidden')
  }

  return {
    stage,
    ref: elementRef,
    shouldMount: () => stage() !== 'hidden',
    complete,
  }
}

export default useTransitionState
