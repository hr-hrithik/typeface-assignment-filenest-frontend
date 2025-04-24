function UploadFileSVGIcon({ className }: { className?: string }) {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M21 3H3M18 13L12 7M12 7L6 13M12 7V21'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default UploadFileSVGIcon;
