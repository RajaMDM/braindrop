import { motion } from 'framer-motion';

/**
 * ModalWrapper — Generic modal container with backdrop blur and slide-up animation.
 * Renders children as the modal content.
 */
export default function ModalWrapper({ onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--bd)',
          borderRadius: 18, padding: 28,
          width: '90%', maxWidth: 540,
          boxShadow: '0 20px 60px rgba(0,0,0,.5)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
