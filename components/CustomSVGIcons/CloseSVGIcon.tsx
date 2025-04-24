function CloseSVGIcon({ className }: { className?: string }) {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 24 24'
      className={className}
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18 6L6 18M6 6L18 18'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default CloseSVGIcon;
