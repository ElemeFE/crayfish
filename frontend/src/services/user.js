const $user = fetch('/api/user', { credentials: 'include' }).then(async response => {
  switch (response.status) {
    case 200:
      return response.json();
    case 401:
      $user.login();
      break;
    default:
      let error = await response.json();
      alert(error.message);
      location.location = this.ssoUrl;
  }
  return new Promise(() => {});
});

$user.SSOURL = location.origin.replace(/crayfish/, 'sso');
$user.login = () => location.href = $user.SSOURL + '/sso/login?from=' + encodeURIComponent(location.href);
